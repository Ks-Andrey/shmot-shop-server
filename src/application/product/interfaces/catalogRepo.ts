import { Catalog } from "../../../domain/product/";
import { UUID } from "../../../types";

export interface ICatalogRepo {
    getCatalogById(id: UUID):Promise<Catalog | null>;
    getAllCatalogs():Promise<Catalog[]>;
    addCatalog(catalog: Catalog):Promise<UUID>;
    deleteCatalog(id: UUID):Promise<void>;
    updateCatalog(catalog: Catalog):Promise<void>;
}