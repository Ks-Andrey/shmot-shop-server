import { signAccess, signRefresh } from "../../utils/jwt";
import { NotFoundError, ValidationError } from "../exceptions";
import { Admin as AdminDTO } from "./dto/admin";
import { IAdminRepo } from "./interfaces/admin.repo";
import { AdminMapper } from "./mappers";

export class AdminService {
    constructor(
        readonly adminRepo: IAdminRepo,
        readonly redisClient: any
    ) { }

    getAllAdmins = async (): Promise<AdminDTO[]> => {
        const admins = await this.adminRepo.getAllAdmins();

        const adminsDTO = admins.map(admin => AdminMapper.adminToAdminDTO(admin));
        return adminsDTO;
    }

    authAdmin = async (user: AdminDTO) => {
        const admin = await this.adminRepo.getAdminByLogin(user.login);

        if (!admin) {
            throw new NotFoundError('Пользователь не найден.');
        }

        if (admin.auth(user.password)) {
            const refreshToken = signRefresh({ userName: user.login, password: user.password});
            const accessToken = signAccess({ userName: user.login, password: user.password });

            await this.redisClient.set(refreshToken, JSON.stringify(user), {
                EX: 60 * 60 * 24 * 7
            });

            return { refreshToken, accessToken, user: admin };   
        } else {
            throw new ValidationError("Неверный пароль.")
        }
    }

    register = async (user: AdminDTO) => {
        const admin = await this.adminRepo.getAdminByLogin(user.login);

        if (!admin?.login || !admin?.password || !admin?.id) {
            const newAdmin = AdminMapper.adminDTOToAdmin(user);

            newAdmin.hash();

            await this.adminRepo.addAdmin(newAdmin);
        } else {
            throw new ValidationError("Такой пользователь уже существует.");
        }
    }

    logout = async (refreshToken: string) => {
        if (!refreshToken) {
            throw new NotFoundError("Refresh токен не предоставлен.");
        }

        await this.redisClient.del(refreshToken);
    }

    refresh = async (refreshToken: string) => {
        if (!refreshToken) {
            throw new NotFoundError('Refresh токен не предоставлен.');
        }

        const userData = await this.redisClient.get(refreshToken);

        if (!userData) {
            throw new ValidationError('Refresh токен недействителен.');
        }

        const user = JSON.parse(userData);

        return { accessToken: signAccess(user), refreshToken };
    }
}
