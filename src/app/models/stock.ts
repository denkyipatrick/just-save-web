import { StockItem } from './stockitem';
import { Branch } from "./branch";

export class Stock {
    branch: Branch;
    items: StockItem[];
    dateString: string;

    constructor(
        public id: string,
        public isActive: boolean,
        public createdAt: Date
        ) {
    }
}
