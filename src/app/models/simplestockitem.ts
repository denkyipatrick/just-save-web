import { IDeletable } from "./ideleteable";

export class SimpleStockItem implements IDeletable {
    isDeleting: boolean = false;

    constructor(
        public id: string,
        public productName: string,
        public productLookupKey: string,
        public quantityStocked: number,
    ) {
    }
}
