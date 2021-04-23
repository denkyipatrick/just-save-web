import { StockItem } from './stockitem';

export class Stock {
    items: StockItem[];
    dateString: string = '';

    constructor(
        public id: string,
        public createdAt: Date,
        public isOpened: boolean) {
    }
}
