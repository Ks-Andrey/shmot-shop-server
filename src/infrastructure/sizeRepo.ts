import { RepositoryError } from "../application/exceptions";
import { ISizeRepo } from "../application/product/interfaces/sizeRepo";
import { Size } from "../domain/product";
import { UUID } from "../types";
import { Pool } from 'pg';

export class SizeRepo implements ISizeRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getSizeById(id: UUID): Promise<Size | null> {
        try {
            const result = await this.pool.query('SELECT * FROM sizes WHERE id = $1', [id]);
            const row = result.rows[0];

            if (!row) return null;

            return Size.create(row?.id, row?.product_id, row?.size_symb, row?.is_active);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения размера.");
        }
    }

    async getSizesByProduct(id: UUID): Promise<Size[]> {
        try {
            const result = await this.pool.query('SELECT * FROM sizes WHERE product_id = $1', [id]);
            return result.rows.map(row => Size.create(row?.id, row?.product_id, row?.size_symb, row?.is_active));
        } catch (error) {
            throw new RepositoryError("Ошибка получения размеров товара.");
        }
    }

    async addSize(size: Size): Promise<UUID> {
        try {
            const result = await this.pool.query(
                'INSERT INTO sizes (id, product_id, size_symb, is_active) VALUES ($1, $2, $3, $4) RETURNING id',
                [size?.id, size?.productId, size?.sizeSymb, size?.isActive]
            );
            return result.rows[0].id;
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка добавления размера.");
        }
    }

    async deleteSize(id: UUID): Promise<void> {
        try {
            await this.pool.query('DELETE FROM sizes WHERE id = $1', [id]);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка удаления размера.");
        }
    }

    async updateSize(size: Size): Promise<void> {
        try {
            await this.pool.query(
                'UPDATE sizes SET is_active = $1 WHERE product_id = $2 AND size_symb = $3',
                [size.isActive, size.productId, size.sizeSymb]
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка изменения размера.");
        }
    }
}

