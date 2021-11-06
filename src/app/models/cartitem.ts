import { StockItem } from './stockitem';
import { BranchProduct } from './branchproduct';

export class CartItem {

    constructor(
        public id: any,
        public quantity: number,
        public soldPrice: number,
        public costPrice?: number,
        public productName?: string,
        public sellingPrice?: number,
        public branchProductAvailableQuantity?: number
    ) {
    }
}
