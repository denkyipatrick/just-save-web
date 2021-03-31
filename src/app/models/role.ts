import { Branch } from './branch';

export class Role {
    constructor(
        public id: string,
        public group: string,
        public displayName: string,
        public createdAt: number,
        public updatedAt: number
        ) {
    }
}
