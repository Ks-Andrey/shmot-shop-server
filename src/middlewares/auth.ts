import { Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Токен не предоставлен', type: 'NotFound' });
        return;
    }

    try {
        const decoded = verifyAccess(token);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({ error: 'Неверный или истёкший токен', type: 'AuthError' });
        return;
    }
}