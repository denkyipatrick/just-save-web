
export class StockItemTransfer {
    constructor(
        public id: string,
        public quantity: number,
        public sendingStockItemId: string,
        public receivingStockItemId: string
    ) { }
}
