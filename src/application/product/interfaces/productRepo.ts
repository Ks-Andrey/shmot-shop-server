import { Product } from "../../../domain/product";
import { UUID } from "../../../types";
import { Product as ProductDTO } from "../dto/product";

export interface IProductRepo {
    getProductById(id: UUID):Promise<Product | null>;
    getProductByIds(ids: UUID[]):Promise<Product[]>
    getProductsByCatalog(id: UUID):Promise<ProductDTO[]>;
    getAllProducts():Promise<ProductDTO[]>;
    addProduct(product: Product):Promise<UUID>;
    deleteProduct(id: UUID):Promise<void>;
    updateProduct(product: Product):Promise<void>;
}