import { Product } from './product';
import { Branch } from "./branch";

export class StockItem {
    branch: Branch;
    product: Product;

    constructor(
        public id: string,
        public quantitySold: number,
        public quantityStocked: number,
        public availableQuantity: number,
        public quantityFromPreviousStock: number
    ) {
    }
}
