import { Size } from "../../../domain/product";
import { UUID } from "../../../types";

export interface ISizeRepo {
    getSizeById(id: UUID):Promise<Size | null>;
    getSizesByProduct(id: UUID):Promise<Size[]>;
    addSize(size: Size):Promise<UUID>;
    deleteSize(id: UUID):Promise<void>;
    updateSize(size: Size):Promise<void>;
}