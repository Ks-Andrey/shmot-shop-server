import { UUID } from "../../../types";

export class Admin {
    constructor(
        readonly id: UUID,
        readonly login: string,
        readonly password: string
    ) { }
}