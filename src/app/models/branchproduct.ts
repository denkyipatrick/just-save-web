import { Product } from './product';
import { Branch } from './branch';

export class BranchProduct {
    branch: Branch;
    product: Product;

    constructor(
      public id: any,
      public branchId: string,
      public productId: string,
      public quantity: number = 10
      ) {
    }
}
