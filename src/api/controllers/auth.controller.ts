import { Request, Response } from "express";
import { AdminService } from "../../application/admin/adminService";

class AuthController {
    constructor (
        readonly adminService: AdminService
    ) { }

    login = async (req: Request, res: Response): Promise<void> => {
        const userData = req.body?.user;

        try {
            const loginData = await this.adminService.authAdmin(userData);
            
            res.status(200).json(loginData);
        } catch (error: any) {
            res.status(500).json({ error: error?.message, type: error?.name });
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.body?.refreshToken;

        try {
            await this.adminService.logout(refreshToken);

            res.status(200).json({ message: 'Вы вышли из системы' });
        } catch (error: any) {
            res.status(500).json({ error: error?.message, type: error?.name });
        }
    }

    refresh = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.body?.refreshToken;

        try {
            const tokens = await this.adminService.refresh(refreshToken);

            res.json(tokens);
        } catch (error: any) {
            res.status(403).json({ error: error?.message, type: error?.name });
        }
    }

    register = async (req: Request, res: Response): Promise<void> => {
        const userData = req.body?.user;

        try {
            await this.adminService.register(userData);

            res.status(200).json({ message: "Успешная регистрация" });
        } catch (error: any) {
            res.status(403).json({ error: error?.message, type: error?.name });
        }
    }

    validate = async (req: any, res: Response): Promise<void> => {
        const user = req?.user;

        if (user) {
            res.status(200).json({ user });    
        } else {
            res.status(403).json({ error: 'Неверный или истёкший токен' });
        }
    }   
}

export default AuthController;
