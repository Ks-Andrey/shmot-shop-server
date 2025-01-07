import { Pool } from 'pg';

const initDb = async (
    user: string,
    host: string,
    database: string,
    password: string,
    port: number
):Promise<Pool> => {
    return await new Pool({
        user,
        host,
        database,
        password,
        port,
    });
    
}

export default initDb;
