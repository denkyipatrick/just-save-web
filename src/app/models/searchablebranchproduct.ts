import { Product } from './product';
import { Branch } from './branch';

export class SearchableBranchProduct {
    constructor(
        public productLookupKey: string,
        public productName: string,
        public productSellingPrice: number,
        public quantity: number = 10
        ) {
    }
}
