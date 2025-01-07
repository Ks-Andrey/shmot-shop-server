import { Pool } from "pg";
import { IAdminRepo } from "../application/admin/interfaces/admin.repo";
import { Admin } from "../domain/admin";
import { Admin as AdminDTO } from "../application/admin/dto/admin";
import { RepositoryError } from "../application/exceptions";

export class AdminRepo implements IAdminRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getAllAdmins(): Promise<Admin[]> {
        try {
            const result = await this.pool.query('SELECT * FROM admins');
            return result.rows.map(row => Admin.create(row?.id, row?.login, row?.password));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения всех администраторов.");
        }
    }

    async authAdmin(login: string, password: string): Promise<Admin | null> {
        try {
            const result = await this.pool.query('SELECT * FROM admins WHERE login = $1 AND password = $2'
                , [login, password]);
            const row = result.rows[0];

            if (!row) return null;
            
            return Admin.create(row?.id, row?.login, row?.password);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения данных администратора.");
        }
    }

    async getAdminByLogin(login: string):Promise<Admin | null> {
        try {
            const result = await this.pool.query('SELECT * FROM admins WHERE login = $1', [login]);
            const row = result.rows[0];

            if (!row) return null; 

            return Admin.create(row?.id, row?.login, row?.password);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения данных по администратора по логину.")   
        }
    }
    
    async addAdmin(adminData: AdminDTO): Promise<void> {
        await this.pool.query('INSERT INTO admins (id, login, password) VALUES ($1, $2, $3)',
            [adminData.id, adminData.login, adminData.password]);
    }
}
