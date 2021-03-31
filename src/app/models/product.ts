import { BranchProduct } from './branchproduct';
import { Branch } from './branch';

export class Product {
    branch: Branch;
    productBranches: BranchProduct[];

    constructor(
        public id: string,
        public name: string,
        public lookupKey: string,
        public quantity: number = 0,
        public unitPrice: number = 0,
        public costPrice: number = 0,
        public sellingPrice: number = 0
        ) {
    }
}
