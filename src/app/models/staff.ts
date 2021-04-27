import { StaffBranch } from './staffbranch';
import { Role } from './role';
import { Branch } from './branch';

export class Staff {
    roles: Role[];
    branch: Branch;
    staffBranch: StaffBranch;

    constructor(
        public id: string,
        public isAdmin: boolean,
        public companyId: string,
        public branchId: string,
        public username: string,
        public lastName: string,
        public firstName: string) {
    }
}
