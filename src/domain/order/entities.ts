import { UUID } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { OrderError } from "./exceptions";

export class Status {
    constructor(
        readonly id: UUID,
        public statusName: string,
    ) {  }

    static create(
        id: UUID,
        statusName: string
    ) {
        if (!statusName || statusName.trim() === '' || statusName.length === 0) {
            throw new OrderError("Имя статуса не может быть пустым");
        }

        return new Status(id || uuidv4(), statusName);
    }

    updateStatusName(
        newStatusName: string
    ) {
        if (!newStatusName || newStatusName.trim() === '' || newStatusName.length === 0) {
            throw new OrderError("Имя статуса не может быть пустым");
        }

        this.statusName = newStatusName;
    }
}

export class OrderItem {
    constructor(
        readonly orderNumber: UUID,
        readonly productId: UUID,
        readonly name: string,
        readonly description: string,
        readonly price: number = 0,
        readonly count: number = 1,
        readonly size: OrderSize
    ) {  }

    static create(
        orderNumber: UUID,
        productId: UUID,
        name: string,
        description: string,
        price: number,
        count: number,
        size: OrderSize
    ) {
        if (!productId) {
            throw new OrderError("Элемент заказа должен быть связан с товаром");
        }
        if (!name || name.trim() === '' || name.length === 0){
            throw new OrderError("Имя товара не может быть пустым");
        }
        if (!price || price <= 0) {
            throw new OrderError("Цена товара должна быть больше 0");
        }

        return new OrderItem(
            orderNumber, 
            productId,
            name,
            description,
            price,
            count,
            size
        );
    }
}

export class OrderSize {
    constructor(
        readonly id: UUID,
        readonly sizeSymb: string
    ) {  }

    static create(
        id: UUID,
        sizeSymb: string
    ): OrderSize {
        return new OrderSize(id, sizeSymb);
    }
}