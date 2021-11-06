import { BranchProduct } from './branchproduct';

export class BranchOrderItem {
  public branchProduct: BranchProduct;

  constructor(
    public id: string,
    public salePrice: number,
    public quantityOrdered: number,
    public orderItemCostPrice: number,
    public orderItemSellingPrice: number
    ) {
  }
}
