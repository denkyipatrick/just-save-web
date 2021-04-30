import { Product } from './product';
import { IDeletable } from "./ideleteable";
import { Stock } from './stock';

export class StockItem implements IDeletable {
    isDeleting = false;
    product: Product;
    stock: Stock;

    constructor(
        public id: string,
        public stockId: string,
        public productId: string,
        public quantity: number,
        public availableQuantity: number
    ) {
    }
}
