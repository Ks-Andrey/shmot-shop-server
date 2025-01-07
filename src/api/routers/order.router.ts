import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authMiddleware } from '../../middlewares/auth';

class OrderRoutes {
    private router: Router;
    private orderController: OrderController;

    constructor(orderController: OrderController) {
        this.router = Router();
        this.orderController = orderController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/orders', authMiddleware, this.orderController.getAllOrders);
        this.router.get('/orders/:id', authMiddleware, this.orderController.getOrderByNumber);
        this.router.post('/orders/', this.orderController.createOrder);
        this.router.put('/orders/status', authMiddleware, this.orderController.changeOrderStatus);

        this.router.get('/statuses', authMiddleware, this.orderController.getAllStatuses);
        this.router.post('/statuses', authMiddleware, this.orderController.addStatus);
        this.router.put('/statuses', authMiddleware, this.orderController.updateStatus);
        this.router.delete('/statuses/:id', authMiddleware, this.orderController.deleteStatus);

        this.router.get('/callback', this.orderController.callbackPayment);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default OrderRoutes;
