import { Role } from './role';

export class RoleGroup {
    constructor(public group: string, public roles: Role[]) {
    }
}