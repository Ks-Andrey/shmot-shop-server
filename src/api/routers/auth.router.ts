import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../../middlewares/auth';

class AuthRouter {
    private router: Router;
    private authController: AuthController;

    constructor(authController: AuthController) {
        this.router = Router();
        this.authController = authController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', this.authController.login);
        this.router.post('/logout', this.authController.logout);
        this.router.post('/refresh', this.authController.refresh);
        this.router.post('/register', this.authController.register);
        this.router.get('/validate', authMiddleware, this.authController.validate);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default AuthRouter;
