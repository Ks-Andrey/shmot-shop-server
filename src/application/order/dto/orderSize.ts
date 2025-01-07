import { UUID } from "crypto";

export class OrderSize {
    constructor(
        readonly id: UUID,
        readonly sizeSymb: string
    ) {  }
}