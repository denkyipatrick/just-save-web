import { Branch } from './branch';
import { OrderItem } from './orderitem';
import { Staff } from 'src/app/models/staff';
import { Company } from './company';

export class Order {
    public staff: Staff;
    public branch: Branch;
    public company: Company;
    public items: OrderItem[];

    public maskedId: string;
    public simpleDate: string;

    constructor(
        public id: string,
        public branchId: string,
        public companyId: string,
        public createdAt: number,
        public updatedAt: number
        ) {
    }
}
