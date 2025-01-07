import { deliveryPrice } from "../..";
import { UUID } from "../../types";
import { OrderItem, Status } from "./entities";
import { OrderError } from "./exceptions";

export class Order { 
    constructor(
        readonly number: UUID,
        readonly fio: string,
        readonly email: string,
        readonly phone: string,
        readonly address: string,
        readonly city: string,
        public price: number = 0,
        public orderItems: OrderItem[] = [],
        public orderStatus: Status,
        public id: UUID = ''
    ) {}

    static create(
        number: UUID,
        fio: string,
        email: string,
        phone: string,
        address: string,
        city: string,
        price: number,
        orderItems: OrderItem[],
        orderStatus: Status,
        id: UUID = ''
    ) {
        if (!fio || fio.trim() === '' || fio.length === 0) {
            throw new OrderError("ФИО не может быть пустым.");
        }
        if (!email || email.trim() === '' || email.length === 0) {
            throw new OrderError("E-mail не может быть пустым.");
        } 
        if (!phone || phone.trim() === '' || phone.length === 0) {
            throw new OrderError("Телефон не может быть пустым.");
        } 
        if (!address || address.trim() === '' || address.length === 0) {
            throw new OrderError("Адресс не может быть пустым.");
        } 
        if (!city || city.trim() === '' || city.length === 0) {
            throw new OrderError("Город не может быть пустым.");
        }

        return new Order(
            number,
            fio,
            email,
            phone,
            address,
            city,
            price,
            orderItems,
            orderStatus,
            id
        );
    }

    changeOrderStatus (newStatus: Status) {
        this.orderStatus = newStatus;
    }

    setOrderItems (orderItems: OrderItem[]) {
        if (!orderItems || orderItems.length === 0) {
            throw new OrderError("Список товаров в заказе не может быть пустым.");
        }

        this.orderItems = orderItems;
        this.price = orderItems.reduce((sum, item) => sum += item.price * item.count, +deliveryPrice);
    }

    setOrderId (orderId: UUID) {
        this.id = orderId;
    }
}