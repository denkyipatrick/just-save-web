

export class SearchableBranchStockItem {
    constructor(
        public productLookupKey: string,
        public productId: string,
        public productName: string,
        public quantity: number,
        public productSellingPrice: number
        ) { }
}
