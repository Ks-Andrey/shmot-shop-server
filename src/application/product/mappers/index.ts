// src/application/mappers/ProductMapper.ts
import { Product, Size, Catalog } from "../../../domain/product";
import { Product as ProductDTO } from "../dto/product";
import { Size as SizeDTO } from "../dto/size";
import { Catalog as CatalogDTO } from "../dto/catalog";
import { v4 as uuidv4} from "uuid";

export class ProductMapper {
    static mapProductToDTO(product: Product): ProductDTO {
        return new ProductDTO(
            product.id,
            product.catalogId,
            product.name,
            product.description,
            product.price,
            product.images
        )
    }

    static mapSizeToDTO(size: Size): SizeDTO {
        return new SizeDTO(
            size.id,
            size.productId,
            size.sizeSymb,
            size.isActive,
        )
    }

    static mapDTOToSize(size: SizeDTO): Size {
        return Size.create(uuidv4(), size.productId, size.sizeSymb, size.isActive);
    }

    static mapCatalogToDTO(catalog: Catalog): CatalogDTO {
        return new CatalogDTO(
            catalog.id,
            catalog.catalogName
        )
    }

    static mapDTOToCatalog(catalogDto: CatalogDTO): Catalog {
        return Catalog.create(uuidv4(), catalogDto.catalogName);
    }

    static mapDTOToProduct(productDto: ProductDTO, sizes: SizeDTO[]): Product {
        const product = Product.create(
            uuidv4(),
            productDto.catalogId,
            productDto.name,
            productDto.description,
            productDto.price,
        );
        const sizeObjects = sizes.map((sizeDto) =>
            Size.create(uuidv4(), product.id, sizeDto.sizeSymb, sizeDto.isActive || true)
        );
        
        product.addSizes(sizeObjects);

        return product;
    }
}
