import { Admin } from "../../../domain/admin";

export interface IAdminRepo {
    getAllAdmins():Promise<Admin[]>;
    authAdmin(login: string, password: string):Promise<Admin | null>;
    getAdminByLogin(login: string):Promise<Admin | null>;
    addAdmin(adminData: Admin):Promise<void>;
}