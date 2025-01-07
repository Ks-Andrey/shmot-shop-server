import { IProductRepo } from "../application/product/interfaces/productRepo";
import { Product, Size } from "../domain/product";
import { Product as ProductDTO } from "../application/product/dto/product";
import { UUID } from "../types";
import { Pool } from 'pg';
import { RepositoryError } from "../application/exceptions";

export class ProductRepo implements IProductRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getProductById(id: UUID): Promise<Product | null> {
        try {
            const result = await this.pool.query(
                `
                SELECT 
                    p.*, 
                    ARRAY_AGG(DISTINCT i.path) AS images,
                    JSON_AGG(DISTINCT s) FILTER (WHERE s.id IS NOT NULL) AS sizes
                FROM 
                    products p
                LEFT JOIN 
                    images i ON p.id = i.product_id
                LEFT JOIN 
                    sizes s ON p.id = s.product_id
                WHERE 
                    p.id = $1
                GROUP BY 
                    p.id
                `,
                [id]
            );
            const row = result.rows[0];
    
            if (!row) return null;
    
            return Product.create(
                row?.id, 
                row?.catalog_id, 
                row?.name, 
                row?.description, 
                row?.price, 
                row?.sizes?.map((size: any) => new Size(size.id, size.product_id, size.size_symb, size.is_active)),
                row?.images
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения товара.");
        }
    }    

    async getProductByIds(ids: UUID[]): Promise<Product[]> {
        try {
            const result = await this.pool.query(
                'SELECT p.*, ARRAY_AGG(i.path) AS images FROM products p LEFT JOIN images i ON p.id = i.product_id WHERE p.id = ANY($1) GROUP BY p.id', 
                [ids]
            );
            return result.rows.map(row => Product.create(row?.id, row?.catalog_id, row?.name, row?.description, row?.price, [], row?.images));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения товара.")
        }
    }

    async getProductsByCatalog(catalogId: UUID): Promise<ProductDTO[]> {
        try {
            const result = await this.pool.query(
                'SELECT p.*, ARRAY_AGG(i.path) AS images FROM products p LEFT JOIN images i ON p.id = i.product_id WHERE p.catalog_id = $1 GROUP BY p.id ORDER BY add_date DESC',
                [catalogId]
            );
    
            return result.rows.map(row => new ProductDTO(row?.id, row?.catalog_id, row?.name, row?.description, row?.price, row?.images));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения товаров по каталогу.");   
        }
    }

    async getAllProducts(): Promise<ProductDTO[]> {
        try {
            const result = await this.pool.query('SELECT p.*, ARRAY_AGG(i.path) AS images FROM products p LEFT JOIN images i ON p.id = i.product_id GROUP BY p.id ORDER BY add_date DESC');
            return result.rows.map(row => new ProductDTO(row?.id, row?.catalog_id, row?.name, row?.description, row?.price, row?.images));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения всех товаров.");
        }
    }

    async addProduct(product: Product): Promise<UUID> {    
        try {
            await this.pool.query('BEGIN');
    
            const result = await this.pool.query(
                `
                WITH inserted_product AS (
                    INSERT INTO products (id, catalog_id, name, description, price)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id
                ),
                inserted_images AS (
                    INSERT INTO images (product_id, path)
                    SELECT id, unnest($6::text[])
                    FROM inserted_product
                )
                INSERT INTO sizes (id, product_id, size_symb, is_active)
                SELECT 
                    size_id, 
                    product_id, 
                    size_symb, 
                    is_active
                FROM (
                    SELECT
                        unnest($7::uuid[]) AS size_id,
                        id AS product_id,
                        unnest($8::text[]) AS size_symb,
                        unnest($9::boolean[]) AS is_active
                    FROM inserted_product
                ) sizes_data
                RETURNING product_id;
                `,
                [
                    product.id,
                    product.catalogId,
                    product.name,
                    product.description,
                    product.price,
                    product.images,
                    product.sizes.map(s => s.id),
                    product.sizes.map(s => s.sizeSymb),
                    product.sizes.map(s => s.isActive),
                ]
            );
            
    
            await this.pool.query('COMMIT');

            return result.rows[0].product_id;
        } catch (error) {
            await this.pool.query('ROLLBACK');

            console.error(error);
            throw new RepositoryError("Ошибка добавления товара.");
        }
    }

    async deleteProduct(id: UUID): Promise<void> {
        try {
            await this.pool.query('BEGIN');
            await this.pool.query('DELETE FROM sizes WHERE product_id = $1', [id]);
            await this.pool.query('DELETE FROM images WHERE product_id = $1', [id]);
            await this.pool.query('DELETE FROM products WHERE id = $1', [id]);
            await this.pool.query('COMMIT');
        } catch (error) {
            await this.pool.query('ROLLBACK');
            console.log(error);
            throw new RepositoryError("Ошибка удаления товара.");
        }
    }

    async updateProduct(product: Product): Promise<void> {
        try {
            await this.pool.query(
                'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4',
                [product.name, product.description, product.price, product.id]
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка обновления товара.");
        }
    }
}
