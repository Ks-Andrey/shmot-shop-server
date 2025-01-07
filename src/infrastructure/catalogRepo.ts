import { RepositoryError } from "../application/exceptions";
import { ICatalogRepo } from "../application/product/interfaces/catalogRepo";
import { Catalog } from "../domain/product";
import { UUID } from "../types";
import { Pool } from 'pg';

export class CatalogRepo implements ICatalogRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getCatalogById(id: UUID): Promise<Catalog | null> {
        try {
            const result = await this.pool.query('SELECT * FROM catalogs WHERE id = $1', [id]);
            const row = result.rows[0];

            if (!row) return null;

            return Catalog.create(row?.id, row?.catalog_name);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения каталога.");
        }
    }

    async getAllCatalogs(): Promise<Catalog[]> {
        try {
            const result = await this.pool.query('SELECT * FROM catalogs ORDER BY add_date ASC');
            return result.rows.map((row:any) => Catalog.create(row?.id, row?.catalog_name));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения всех каталогов.");
        }
    }

    async addCatalog(catalog: Catalog): Promise<UUID> {
        try {
            const result = await this.pool.query(
                'INSERT INTO catalogs (id, catalog_name) VALUES ($1, $2) RETURNING id',
                [catalog.id, catalog.catalogName]
            );
            return result.rows[0].id;
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка добавления каталога.");
        }
    }

    async deleteCatalog(id: UUID): Promise<void> {
        try {
            await this.pool.query('DELETE FROM catalogs WHERE id = $1', [id]);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка удаления каталога.");
        }
    }

    async updateCatalog(catalog: Catalog): Promise<void> {
        try {
            await this.pool.query('UPDATE catalogs SET catalog_name = $1 WHERE id = $2', [catalog.catalogName, catalog.id]);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка обновления каталога.");
        }
    }
}
