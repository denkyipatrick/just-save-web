import { Product } from './product';
import { IDeletable } from "./ideleteable";

export class StockItem implements IDeletable {
    isDeleting = false;
    product: Product;

    constructor(public id: string) {
    }
}
