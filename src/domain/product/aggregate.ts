import { UUID } from "../../types";
import { Size } from "./entities";
import { ProductError } from "./exceptions";

export class Product {
    constructor(
        public id: UUID,
        public catalogId: UUID,
        public name: string,
        public description: string,
        public price: number,
        public sizes: Size[] = [],
        public images: string[] = [],
    ) {  }

    static create(
        id: UUID,
        catalogId: UUID,
        name: string,
        description: string,
        price: number,
        sizes: Size[] = [],
        images: string[] = []
    ) {
        if (!catalogId) {
            throw new ProductError("Товар должен принадлежать какой-либо категории.");
        }
        if (!name || name.trim() === '' || name.length === 0) {
            throw new ProductError("Имя товара не может быть пустым.");
        }
        if (!price || price <= 0) {
            throw new ProductError("Цена должна быть больше 0.")
        }
        
        return new Product(id, catalogId, name, description, price, sizes, images);
    }

    updateProductDetails(name: string, description: string, price: number, sizes: Size[]): void {
        if (!name || name.trim() === '' || name.length === 0) {
            throw new ProductError("Имя товара не может быть пустым.");
        }
        if (!name || price <= 0) {
            throw new ProductError("Цена должна быть больше 0.")
        }
        this.name = name;
        this.description = description;
        this.price = price;
        this.sizes = sizes;
    }

    addSizes(sizes: Size[]) {
        this.sizes = sizes;
    }
}