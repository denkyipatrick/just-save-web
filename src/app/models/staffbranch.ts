import { Branch } from './branch';
import { Company } from './company';

export class StaffBranch {
    branch: Branch;

    constructor(public id: string, staffId: string, branchId: string) {
    }
}
