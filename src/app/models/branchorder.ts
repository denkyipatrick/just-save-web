import { BranchOrderItem } from './branchorderitem';
import { Branch } from './branch';
import { Staff } from 'src/app/models/staff';

export class BranchOrder {
    public staff: Staff;
    public branch: Branch;
    // public company: Company;
    public items: BranchOrderItem[];

    public maskedId: string;
    public simpleDate: string;

    constructor(
        public id: string,
        public branchId: string,
        public createdAt: number,
        public updatedAt: number
        ) {
    }
}
