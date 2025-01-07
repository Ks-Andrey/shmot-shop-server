import jwt from 'jsonwebtoken';
import { accessSecret, refreshSecret } from '..';

type UserProps = {
    userName: string,
    password: string
};

export const signRefresh = (data: UserProps) => {
    return jwt.sign(data, refreshSecret, { expiresIn: '7d' })
}

export const signAccess = (data: UserProps) => {
    return jwt.sign(data, accessSecret, { expiresIn: '1h' })
}

export const verifyRefresh = (token: string) => {
    return jwt.verify(token, refreshSecret);
}

export const verifyAccess = (token: string) => {
    return jwt.verify(token, accessSecret);
}
