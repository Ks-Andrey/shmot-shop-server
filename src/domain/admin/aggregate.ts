import { UUID } from "../../types";
import { generate, verify } from 'password-hash';
import { AdminError } from "./exceptions";

export class Admin {
    constructor(
        readonly id: UUID,
        readonly login: string,
        public password: string
    ) { }

    static create(
        id: UUID,
        login: string,
        password: string
    ): Admin {
        if (!login || login.trim() === '' || login.length === 0 
            && !password || password.trim() === '' || password.length === 0
        ) {
            throw new AdminError("Входные поля не могут быть пустыми.");
        }

        if (!login || login.trim() === '' || login.length === 0) {
            throw new AdminError("Имя пользователя не может быть пустым.");
        }

        if (!password || password.trim() === '' || password.length === 0) {
            throw new AdminError("Пароль пользователя не может быть пустым.");
        }

        return new Admin(id, login, password);
    }

    auth(password: string): boolean {
        return verify(password, this.password);
    }

    hash() {
        this.password = generate(this.password);
    }
}