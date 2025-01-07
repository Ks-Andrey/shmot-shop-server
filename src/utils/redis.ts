import { createClient } from "redis";

export const initClient = async () => {
    return await createClient()
        .on('error', err => console.log('Ошибка инициализации redis', err))
        .connect();
} 
