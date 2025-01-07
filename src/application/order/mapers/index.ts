import { v4 as uuidv4 } from "uuid";
import { Order, Status, OrderItem } from "../../../domain/order";
import { Order as OrderDTO} from "../dto/order";
import { OrderItem as OrderItemDTO } from "../dto/orderItem";
import { Status as StatusDTO } from "../dto/status";
import { Product } from "../../../domain/product";
import { OrderSize } from "../../../domain/order/entities";

export class OrderMapper {
    static mapDTOToOrderItems(
        orderItemsDto: OrderItemDTO[],
        order: Order,
        products: Product[]
    ): OrderItem[] {
        return products.map((product, i) => OrderItem.create(
            order.number,
            product.id,
            product.name,
            product.description,
            product.price,
            orderItemsDto[i].count,
            OrderSize.create(
                orderItemsDto[i].size.id,
                orderItemsDto[i].size.sizeSymb,
            )
        ));
    }

    static mapDTOToOrder(
        orderDto: OrderDTO,
        defaultStatus: Status
    ): Order {
        return Order.create(
            uuidv4(),
            orderDto.fio,
            orderDto.email,
            orderDto.phone,
            orderDto.address,
            orderDto.city,
            0,
            [],
            defaultStatus
        );
    }

    static mapDTOToStatus = (
        statusDto: StatusDTO
    ): Status => {
        return Status.create(uuidv4(), statusDto.statusName);
    }

    static mapStatusToDTO = (
        status: Status
    ): StatusDTO => {
        return new StatusDTO(status.id, status.statusName);
    }
}