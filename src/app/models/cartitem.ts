import { BranchProduct } from './branchproduct';

export class CartItem {
    id: string;

    constructor(
        public quantity: number,
        public soldPrice: number,
        public branchProduct?: BranchProduct) {
        this.id = this.branchProduct?.product?.id;
    }
}
