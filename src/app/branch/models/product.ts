
export class Product {
  constructor(
    public id: string,
    public name: string,
    public lookupKey: string,
    public quantity: number = 0,
    public unitPrice: number = 0,
    public costPrice: number = 0,
    public sellingPrice: number = 0
  ) { }
}