import { Order } from "../../domain/order";
import { UUID } from "../../types";
import { Order as OrderDTO } from "./dto/order";
import { OrderItem as OrderItemDTO } from "./dto/orderItem";
import { IOrderRepo } from "./interfaces/orderRepo";
import { IStatusRepo } from "./interfaces/statusRepo";
import { OrderMapper } from "./mapers";
import { Status as StatusDTO } from "./dto/status";
import { IProductRepo } from "../product/interfaces/productRepo";
import { NotFoundError, ValidationError } from "../exceptions";
import { makePayment } from "../../utils/payments";
import { verifyChecksum } from "../../utils/checksum";
import { secretKey, successPageLink } from "../..";

class OrderService {
    constructor(
        readonly orderRepo: IOrderRepo,
        readonly statusRepo: IStatusRepo,
        readonly productRepo: IProductRepo
    ) {}

    // Создать заказ
    createOrder = async (orderDto: OrderDTO, orderItemsDto: OrderItemDTO[]): Promise<string> => {
        const statuses = await this.statusRepo.getAllStatuses();
        if (statuses.length === 0) throw new NotFoundError("Статусы не найдены.");
        const defaultStatus = statuses[0];
    
        const productIds = orderItemsDto.map(item => item.productId);
        const products = await this.productRepo.getProductByIds(productIds);

        if (products.length !== productIds.length) {
            throw new ValidationError("Не все товары найдены");
        }
            
        const order = OrderMapper.mapDTOToOrder(orderDto, defaultStatus);
        const orderItems = OrderMapper.mapDTOToOrderItems(orderItemsDto, order, products);
        order.setOrderItems(orderItems);

        const { formUrl, orderId } = await makePayment(order.price, successPageLink, order.number);
        order.setOrderId(orderId);
    
        await this.orderRepo.addOrder(order);
    
        return formUrl;
    }

    // Получить все заказы
    getAllOrders = async (): Promise<OrderDTO[]> => {
        return await this.orderRepo.getAllOrders();
    }

    // Получить заказ по id
    getOrderByNumber = async (number: UUID): Promise<Order | null> => {
        const order = await this.orderRepo.getOrderByNumber(number);
        if (!order) throw new NotFoundError("Заказ не найден.");
        return order;
    }

    // Изменить статус заказа
    changeOrderStatus = async (orderNumber: UUID, statusId: UUID): Promise<void> => {
        const order = await this.orderRepo.getOrderByNumber(orderNumber);
        if (!order) throw new NotFoundError("Заказ не найден.");

        const status = await this.statusRepo.getStatusById(statusId);
        if (!status) throw new NotFoundError("Статус не найден.");

        order.changeOrderStatus(status); 
        await this.orderRepo.updateOrder(order);
    }

    // Получить все статусы
    getAllStatuses = async () => {
        const statuses = await this.statusRepo.getAllStatuses();
        return statuses.map(OrderMapper.mapStatusToDTO);
    }

    // Добавить новый статус
    addStatus = async (statusDto: StatusDTO): Promise<UUID> => {
        const status = OrderMapper.mapDTOToStatus(statusDto);
        return await this.statusRepo.addStatus(status); 
    }

    // Удалить статус
    deleteStatus = async (statusId: UUID): Promise<void> => {
        await this.statusRepo.deleteStatus(statusId); 
    }

    // Изменить статус
    updateStatus = async (statusDto: StatusDTO): Promise<void> => {
        const status = await this.statusRepo.getStatusById(statusDto.id); 
        if (!status) throw new NotFoundError("Статус не найден."); 

        status.updateStatusName(statusDto.statusName);
        await this.statusRepo.updateStatus(status);
    }

    //callback
    callbackPayment = async (params: Record<string, string>): Promise<void> => {
        if (!verifyChecksum(secretKey, params)) {
            throw new ValidationError("Ключ неверный");
        }
        
        const { operation, status, orderNumber } = params;

        if (operation === 'deposited' && +status === 1) {
            const statuses = await this.statusRepo.getAllStatuses();
            if (statuses.length === 0) throw new NotFoundError("Статусы не найдены.");
            const paymentStatus = statuses[1];

            const order = await this.getOrderByNumber(orderNumber);
            if (!order) throw new NotFoundError("Заказ не найден.");
            order.changeOrderStatus(paymentStatus);

            await this.orderRepo.updateOrder(order);
        }
    }
}

export default OrderService;