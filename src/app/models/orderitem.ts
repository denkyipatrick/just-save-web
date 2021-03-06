import { Product } from './product';

export class OrderItem {
    public product: Product;

    constructor(
        public id: string,
        public salePrice: number,
        public quantityOrdered: number,
        public orderItemCostPrice: number,
        public orderItemSellingPrice: number
        ) {
    }
}
