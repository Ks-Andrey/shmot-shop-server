import { Request, Response } from 'express';
import ProductService from '../../application/product/productServise';

class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    getAllProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json(products);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    getProductById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const product = await this.productService.getProductById(id);
            res.status(200).json(product);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    getProductsByCatalog = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const products = await this.productService.getProductsByCatalog(id);
            res.status(200).json(products);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    addProduct = async (req: Request, res: Response): Promise<void> => {
        const { product, sizes } = req.body;

        try {
            if (req.files) {
                const productId = await this.productService.addProduct(
                    JSON.parse(product),
                    JSON.parse(sizes),
                    req.files
                );
                res.status(201).json({ id: productId });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };
    
    updateProduct = async (req: Request, res: Response): Promise<void> => {
        const { product } = req.body;
        try {
            await this.productService.updateProduct(product);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            await this.productService.deleteProduct(id);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    getAllCatalogs = async (req: Request, res: Response): Promise<void> => {
        try {
            const catalogs = await this.productService.getAllCatalogs();
            res.status(200).json(catalogs);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    addCatalog = async (req: Request, res: Response): Promise<void> => {
        const { catalog } = req.body;
        try {
            const catalogId = await this.productService.addCatalog(catalog);
            res.status(201).json({ id: catalogId });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    updateCatalog = async (req: Request, res: Response): Promise<void> => {
        const { catalog } = req.body;
        try {
            await this.productService.updateCatalog(catalog);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    deleteCatalog = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            await this.productService.deleteCatalog(id);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    addSize = async (req: Request, res: Response): Promise<void> => {
        const { size } = req.body;
        try {
            const sizeId = await this.productService.addSize(size);
            res.status(201).json({ id: sizeId });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    deleteSize = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            await this.productService.deleteSize(id);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };

    toggleSizeStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            await this.productService.toggleSizeStatus(id);
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message, type: error.name });
        }
    };
}

export default ProductController;
