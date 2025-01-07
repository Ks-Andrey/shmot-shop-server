import {  Product } from "../../domain/product/";
import { Product as ProductDTO } from "./dto/product";
import { Size as SizeDTO } from "./dto/size";
import { Catalog as CatalogDTO } from "./dto/catalog";
import { UUID } from "../../types";
import { ICatalogRepo } from "./interfaces/catalogRepo";
import { IProductRepo } from "./interfaces/productRepo";
import { ISizeRepo } from "./interfaces/sizeRepo";
import { ProductMapper } from "./mappers";
import { NotFoundError } from "../exceptions";

class ProductService {
    constructor(
        private readonly productRepo: IProductRepo,
        private readonly catalogRepo: ICatalogRepo,
        private readonly sizeRepo: ISizeRepo
    ) {}

    // Получения всех товаров
    getAllProducts = async (): Promise<ProductDTO[]> => {
        return await this.productRepo.getAllProducts();
    };

    // Получение товара по id
    getProductById = async (id: UUID): Promise<Product | null> => {
        const product = await this.productRepo.getProductById(id);
        if (!product) throw new NotFoundError("Товар не найден.");

        return product;
    };

    // Получения товаров по категории
    getProductsByCatalog = async (catalogId: UUID): Promise<ProductDTO[]> => {
        return await this.productRepo.getProductsByCatalog(catalogId);
    };
    
    // Добавление товара
    addProduct = async (productDto: ProductDTO, sizesDto: SizeDTO[], files: any): Promise<UUID> => {
        const product = ProductMapper.mapDTOToProduct(productDto, sizesDto);

        if (files && Array.isArray(files)) {
            files.forEach((file: any) => {
                const filePath = `/uploads/${file.filename}`;
                product.images.push(filePath);
            });
        }

        const producId = await this.productRepo.addProduct(product);

        return producId;
    };

    // Обновление товара
    updateProduct = async (productDto: ProductDTO): Promise<void> => {
        const product = await this.productRepo.getProductById(productDto.id);
        if (!product) throw new NotFoundError("Товар не найден.");
    
        product.updateProductDetails(productDto.name, productDto.description, productDto.price, product.sizes);
    
        await this.productRepo.updateProduct(product);
    };

    // Удаление продукта
    deleteProduct = async (id: UUID): Promise<void> => {
        await this.productRepo.deleteProduct(id);
    };

    // Получение всех каталогов
    getAllCatalogs = async (): Promise<CatalogDTO[]> => {
        const catalogs = await this.catalogRepo.getAllCatalogs();
        return catalogs.map(ProductMapper.mapCatalogToDTO);
    };

    // Добавление каталого
    addCatalog = async (catalogDto: CatalogDTO): Promise<UUID> => {
        const catalog = ProductMapper.mapDTOToCatalog(catalogDto);
        return this.catalogRepo.addCatalog(catalog);
    };

    // Обновление каталога
    updateCatalog = async (catalogDto: CatalogDTO): Promise<void> => {
        const catalog = await this.catalogRepo.getCatalogById(catalogDto.id);
        if (!catalog) throw new NotFoundError("Каталог не найден.");

        catalog.updateCatalog(catalogDto.catalogName);
        await this.catalogRepo.updateCatalog(catalog);
    };

    // Удаление всех каталогов
    deleteCatalog = async (id: UUID): Promise<void> => {
        await this.catalogRepo.deleteCatalog(id);
    };

    // Добавление размера
    addSize = async (sizeDto: SizeDTO): Promise<UUID> => {
        const size = ProductMapper.mapDTOToSize(sizeDto);
        return await this.sizeRepo.addSize(size);
    };

    // Удаление размера
    deleteSize = async (sizeId: UUID): Promise<void> => {
        await this.sizeRepo.deleteSize(sizeId);
    };

    // Переключение статуса доступности размера
    toggleSizeStatus = async (sizeId: UUID): Promise<void> => {
        const size = await this.sizeRepo.getSizeById(sizeId);
        if (!size) throw new NotFoundError("Размер не найден.");

        size.toggleActive();
        await this.sizeRepo.updateSize(size);
    };
}

export default ProductService;