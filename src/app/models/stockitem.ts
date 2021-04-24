import { IDeletable } from "./ideleteable";

export class StockItem implements IDeletable {
    isDeleting = false;

    constructor(public id: string) {
    }
}
