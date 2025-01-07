import { UUID } from "../../types";
import { ProductError } from "./exceptions";

export class Size {
    constructor(
        readonly id: UUID,
        readonly productId: UUID,
        readonly sizeSymb: string,
        public isActive: boolean = false
    ) { }

    static create(
        id: UUID,
        productId: UUID,
        sizeSymb: string,
        isActive: boolean
    ) {
        if (!productId) {
            throw new ProductError("Размер должен быть привязан к определенному товару");
        }
        if (!sizeSymb || sizeSymb.trim() === '' || sizeSymb.length === 0) {
            throw new ProductError("Значение размера не должен быть пустым");
        }

        return new Size(id, productId, sizeSymb, isActive);
    }

    toggleActive() {
        if (this.isActive) {
            this.isActive = false;
        } else {
            this.isActive = true;
        }
    }
}

export class Catalog {
    constructor(
        readonly id: UUID,
        private _catalogName: string
    ) { }

    
    public get catalogName() : string {
        return this._catalogName;
    }
    
    public set catalogName(v : string) {
        this._catalogName = v;
    }
    

    static create( 
        id: UUID,
        catalogName: string
    ) {
        if (!catalogName || catalogName.trim() === '' || catalogName.length === 0) {
            throw new ProductError("Название каталога не должен быть пустым");
        }
        return new Catalog(id, catalogName);
    }

    updateCatalog(
        catalogName: string
    ) {
        if (!catalogName || catalogName.trim() === '' || catalogName.length === 0) {
            throw new ProductError("Название каталога не должен быть пустым");
        }
        this.catalogName = catalogName;
    }
}