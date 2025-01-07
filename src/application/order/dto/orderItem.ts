import { UUID } from "../../../types";
import { OrderSize } from "./orderSize";

export class OrderItem {
    constructor(
        readonly orderId: UUID,
        readonly productId: UUID,
        readonly name: string,
        readonly description: string,
        readonly price: number,
        readonly count: number,
        readonly size: OrderSize
    ) {  }
}