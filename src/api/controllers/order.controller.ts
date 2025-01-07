import { Request, Response } from 'express';
import OrderService from "../../application/order/orderService";

class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    // Оформить заказ
    createOrder = async (req: Request, res: Response): Promise<void> => {
        const { order, orderItems } = req.body;
        try {
            const formUrl = await this.orderService.createOrder(order, orderItems);

            res.status(200).json(formUrl);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Получить все заказы
    getAllOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await this.orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Получить заказ по id
    getOrderByNumber = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const order = await this.orderService.getOrderByNumber(id);
            res.status(200).json(order);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Изменить статус заказа
    changeOrderStatus = async (req: Request, res: Response): Promise<void> => {
        const { orderNumber, statusId } = req.body;
        try {
            await this.orderService.changeOrderStatus(orderNumber, statusId);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Посмотреть все статусы
    getAllStatuses = async (req: Request, res: Response): Promise<void> => {
        try {
            const statuses = await this.orderService.getAllStatuses(); 
            res.status(201).json(statuses);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Добавить новый статус
    addStatus = async (req: Request, res: Response): Promise<void> => {
        const { status } = req.body;
        try {
            const statusId = await this.orderService.addStatus(status); 
            res.status(201).json({ id: statusId });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Удалить статус
    deleteStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            await this.orderService.deleteStatus(id);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    // Изменить статус
    updateStatus = async (req: Request, res: Response): Promise<void> => {
        const { status } = req.body;
        try {
            await this.orderService.updateStatus(status);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    //callback
    callbackPayment = async (req: Request, res: Response): Promise<void> => {
        const params = req.query as Record<string, string>;

        try {
            await this.orderService.callbackPayment(params);
            res.sendStatus(200);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    }
}

export default OrderController;
