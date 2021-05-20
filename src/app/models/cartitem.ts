import { StockItem } from './stockitem';
import { BranchProduct } from './branchproduct';

export class CartItem {
    id: string;

    constructor(
        public quantity: number,
        public soldPrice: number,
        public stockItemId: string,
        public stockItem?: StockItem
    ) {
        this.id = this.stockItem?.product?.id;
    }
}
