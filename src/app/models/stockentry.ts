import { Branch } from './branch';
import { StockEntryItem } from './stockentryitem';

export class StockEntry {
    branch: Branch;
    items: StockEntryItem[];
    dateString: string = '';

    constructor(
        public id: string,
        public branchId: string,
        public createdAt: Date,
        public isOpened: boolean) {
    }
}
