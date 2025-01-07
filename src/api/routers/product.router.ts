import { Router, Request } from 'express';
import ProductController from '../controllers/product.controller';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../../middlewares/auth';

class ProductRoutes {
    private router: Router;
    private productController: ProductController;

    constructor(productController: ProductController) {
        this.router = Router();
        this.productController = productController;
        this.initializeRoutes();
    }

    private getMulter = () => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './dist/uploads');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
                cb(null, filename);
            }
        });
    
        const fileFilter = (req: Request, file: any, cb: any) => {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
            }
        };
    
        return multer({
            storage,
            fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        });
    };

    private initializeRoutes() {
        const upload = this.getMulter().array('images', 10);

        this.router.get('/products', this.productController.getAllProducts);
        this.router.get('/products/:id', this.productController.getProductById);
        this.router.get('/products/catalog/:id', this.productController.getProductsByCatalog);
        this.router.post('/products', authMiddleware, upload, this.productController.addProduct);
        this.router.put('/products/', authMiddleware, this.productController.updateProduct);
        this.router.delete('/products/:id', authMiddleware, this.productController.deleteProduct);

        // Каталоги
        this.router.get('/catalogs', this.productController.getAllCatalogs);
        this.router.post('/catalogs', authMiddleware, this.productController.addCatalog);
        this.router.put('/catalogs/', authMiddleware, this.productController.updateCatalog);
        this.router.delete('/catalogs/:id', authMiddleware, this.productController.deleteCatalog);

        // Размеры
        this.router.post('/sizes', authMiddleware, this.productController.addSize);
        this.router.delete('/sizes/:id', authMiddleware, this.productController.deleteSize);
        this.router.put('/sizes/:id/toggle', authMiddleware, this.productController.toggleSizeStatus);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default ProductRoutes;
