import { Company } from './company';

export class Branch {
    company: Company;

    constructor(public id: string, public location: string, public address: string) {
    }
}
