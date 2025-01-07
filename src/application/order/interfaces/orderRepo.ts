import { UUID } from "../../../types"
import { Order } from "../../../domain/order"; 
import { Order as OrderDTO } from "../dto/order";

export interface IOrderRepo {
    getAllOrders():Promise<OrderDTO[]>;
    getOrderByNumber(id: UUID):Promise<Order | null>;
    addOrder(order: Order):Promise<UUID>;
    updateOrder(order: Order):Promise<void>;
    deleteOrder(id: UUID):Promise<void>;
}