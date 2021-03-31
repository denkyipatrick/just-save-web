import { Role } from './role';
import { Branch } from './branch';

export class Staff {
    roles: Role[];
    branch: Branch;

    constructor(
        public branchId: string,
        public username: string,
        public lastName: string,
        public firstName: string) {
    }
}
