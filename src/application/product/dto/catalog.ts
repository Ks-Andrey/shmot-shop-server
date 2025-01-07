import { UUID } from "../../../types";

export class Catalog {
    constructor(
        readonly id: UUID,
        readonly catalogName: string
    ) { }
}