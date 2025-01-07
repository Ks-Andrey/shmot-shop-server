import { UUID } from "../../../types";
import { Status } from "./status";

export class Order { 
    constructor(
        readonly number: UUID,
        readonly fio: string,
        readonly email: string,
        readonly phone: string,
        readonly address: string,
        readonly city: string,
        readonly price: number,
        readonly status: Status,
        readonly id: UUID
    ) {}
}