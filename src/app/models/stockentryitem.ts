import { Product } from './product';
import { IDeletable } from "./ideleteable";
import { StockEntry } from './stockentry';

export class StockEntryItem implements IDeletable {
    isDeleting = false;
    product: Product;
    stockEntry: StockEntry;

    constructor(
        public id: string,
        public stockId: string,
        public productId: string,
        public quantity: number,
        public availableQuantity: number
    ) {
    }
}
