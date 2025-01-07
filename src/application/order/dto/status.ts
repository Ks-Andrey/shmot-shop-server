import { UUID } from "../../../types";

export class Status {
    constructor(
        readonly id: UUID,
        readonly statusName: string,
    ) {  }
}