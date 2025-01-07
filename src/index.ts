import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
dotenv.config();

import ProductController from './api/controllers/product.controller';
import OrderController from './api/controllers/order.controller';

import ProductService from './application/product/productServise';
import OrderService from './application/order/orderService';

import ProductRoutes from './api/routers/product.router';
import OrderRoutes from './api/routers/order.router';

import { CatalogRepo } from './infrastructure/catalogRepo';
import { OrderRepo } from './infrastructure/orderRepo';
import { ProductRepo } from './infrastructure/productRepo';
import { SizeRepo } from './infrastructure/sizeRepo';
import { StatusRepo } from './infrastructure/statusRepo';

import initDb from './utils/db';
import { initClient } from './utils/redis';
import { AdminRepo } from './infrastructure/adminRepo';
import { AdminService } from './application/admin/adminService';
import AuthController from './api/controllers/auth.controller';
import AuthRouter from './api/routers/auth.router';

//config
export const refreshSecret = process.env.REFRESH_SECRET || 'TESTREF_2024';
export const accessSecret = process.env.ACCESS_SECRET || 'TESTACC_2024';
export const secretKey = process.env.ALFA_SECRET_KEY || '';
export const userName = process.env.ALFA_NAME || '';
export const password = process.env.ALFA_PASSWORD || '';
export const deliveryPrice = process.env.DELIVERY_PRICE || 12;
export const successPageLink = process.env.SUCCESS_PAGE_LINK || 'http://localhost:3000/success';

(async () => {
    const redisClient = await initClient();

    const pool = await initDb(
        process.env.DB_USER || '',
        process.env.DB_HOST || '',
        process.env.DB_NAME || '',
        process.env.DB_PASSWORD || '',
        Number(process.env.DB_PORT) || 5432
    );

    const catalogRepo = new CatalogRepo(pool);
    const orderRepo = new OrderRepo(pool);
    const productRepo = new ProductRepo(pool);
    const sizeRepo = new SizeRepo(pool);
    const statusRepo = new StatusRepo(pool);
    const adminRepo = new AdminRepo(pool);

    const productService = new ProductService(productRepo, catalogRepo, sizeRepo);
    const orderService = new OrderService(orderRepo, statusRepo, productRepo);
    const adminService = new AdminService(adminRepo, redisClient);

    const productController = new ProductController(productService);
    const orderController = new OrderController(orderService);
    const adminController = new AuthController(adminService);

    const productRoutes = new ProductRoutes(productController);
    const orderRoutes = new OrderRoutes(orderController);
    const authRoutes = new AuthRouter(adminController);

    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use('/api', productRoutes.getRouter());
    app.use('/api', orderRoutes.getRouter());
    app.use('/api', authRoutes.getRouter());

    app.use(express.static(path.join(__dirname, 'build')));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
