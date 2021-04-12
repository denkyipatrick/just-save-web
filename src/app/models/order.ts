import { OrderItem } from './orderitem';
import { Staff } from 'src/app/models/staff';
import { Company } from './company';

export class Order {
    public staff: Staff;
    public company: Company;
    public items: OrderItem[];

    public simpleDate: string;

    constructor(
        public id: string,
        public companyId: string,
        public createdAt: number,
        public updatedAt: number
        ) {
    }
}
