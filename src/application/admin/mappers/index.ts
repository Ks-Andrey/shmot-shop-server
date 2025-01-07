import { Admin } from "../../../domain/admin";
import { Admin as AdminDTO } from "../dto/admin";
import { v4 as uuidv4 } from "uuid";

export class AdminMapper {
    static adminToAdminDTO(admin: Admin): AdminDTO {
        return new AdminDTO(admin.id, admin.login, admin.password);
    }

    static adminDTOToAdmin(adminDTO: AdminDTO): Admin {
        return Admin.create(uuidv4(), adminDTO.login, adminDTO.password);
    }
}
