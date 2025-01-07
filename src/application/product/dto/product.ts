import { UUID } from "../../../types";

export class Product {
    constructor(
        public id: UUID,
        public catalogId: UUID,
        public name: string,
        public description: string,
        public price: number,
        public images: string[]
    ) {  }
}