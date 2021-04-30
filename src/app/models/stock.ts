import { Branch } from './branch';
import { StockItem } from './stockitem';

export class Stock {
    branch: Branch;
    items: StockItem[];
    dateString: string = '';

    constructor(
        public id: string,
        public branchId: string,
        public createdAt: Date,
        public isOpened: boolean) {
    }
}
