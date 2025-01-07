import { IOrderRepo } from "../application/order/interfaces/orderRepo";
import { Order, OrderItem } from "../domain/order";
import { Order as OrderDTO } from "../application/order/dto/order";
import { UUID } from "../types";
import { Pool } from 'pg';
import { OrderSize, Status } from "../domain/order/entities";
import { RepositoryError } from "../application/exceptions";
import { Status as StatusDTO } from "../application/order/dto/status";

export class OrderRepo implements IOrderRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getAllOrders(): Promise<OrderDTO[]> {
        try {
            const result = await this.pool.query('SELECT o.*, s.status_name FROM orders o INNER JOIN statuses s ON s.id = o.status_id ORDER BY add_date DESC');
            return result.rows.map(row => new OrderDTO(row?.order_number, row?.user_fio, row?.email, row?.phone, row?.address, row?.city, row?.price, 
               new StatusDTO(row?.status_id, row?.status_name),
               row?.id
            ));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения всех заказов.");
        }
    }

    async getOrderByNumber(number: UUID): Promise<Order | null> {
        try { 
            const result = await this.pool.query('SELECT o.*, s.status_name FROM orders o INNER JOIN statuses s ON s.id = o.status_id WHERE o.order_number = $1', [number]);
            const row = result.rows[0];

            if (!row) return null;

            const orderItems = await this.getOrderItems(number);

            return Order.create(row?.order_number, row?.user_fio, row?.email, row?.phone, row?.address, row?.city, row?.price, orderItems, 
                Status.create(row?.status_id, row?.status_name),
                row?.id
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения заказа.")
        }
    }

    async addOrder(order: Order): Promise<UUID> {
        try {
            await this.pool.query('BEGIN');
            const result = await this.pool.query(
                'INSERT INTO orders (order_number, user_fio, email, phone, address, city, price, status_id, id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
                [order.number, order.fio, order.email, order.phone, order.address, order.city, order.price, order.orderStatus?.id, order?.id]
            );
    
            await this.addOrderItems(order.orderItems);
            await this.pool.query('COMMIT');
            
            return result.rows[0].id;
        } catch (error) {
            await this.pool.query('ROLLBACK');
            console.log(error);
            throw new RepositoryError("Ошибка создания заказа.");
        }
    }

    async updateOrder(order: Order): Promise<void> {
        try {
            await this.pool.query(
                'UPDATE orders SET price = $1, status_id = $2 WHERE order_number = $3',
                [order.price, order.orderStatus?.id, order.number]
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка изменения заказа.");
        }
    }

    async deleteOrder(id: UUID): Promise<void> {
        try {
            await this.pool.query('DELETE FROM orders WHERE order_number = $1', [id]);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка удаления заказа");
        }
    }

    private async getOrderItems(orderNumber: UUID): Promise<OrderItem[]> {
        try {
            const result = await this.pool.query(`
                SELECT 
                    oi.order_number,
                    oi.product_id,
                    p.name as product_name,
                    p.description as product_description,
                    p.price,
                    s.size_symb as size_name,
                    oi.size_id,
                    oi.count
                FROM order_items oi 
                INNER JOIN products p ON p.id = oi.product_id
                INNER JOIN sizes s ON s.id = oi.size_id
                WHERE oi.order_number = $1`,
            [orderNumber]);
    
            return result.rows.map(row => OrderItem.create(
                row?.order_number,
                row?.product_id,
                row?.product_name,
                row?.product_description,
                row?.price,
                row?.count,
                OrderSize.create(row?.size_id, row?.size_name)
            ));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения товаров из заказа.");
        }
    }

    private async addOrderItems(orderItems: OrderItem[]): Promise<void> {
        try {
            const queryText = 'INSERT INTO order_items (order_number, product_id, size_id, count) VALUES ($1, $2, $3, $4)';
            for (const item of orderItems) {
                await this.pool.query(queryText, [item.orderNumber, item.productId, item.size.id, item.count]);
            }
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка добавления товаров в заказ.");
        }
    }
}
