import { UUID } from "../../../types";

export class Size {
    constructor(
        readonly id: UUID,
        readonly productId: UUID,
        readonly sizeSymb: string,
        public isActive: boolean = false
    ) { }
}