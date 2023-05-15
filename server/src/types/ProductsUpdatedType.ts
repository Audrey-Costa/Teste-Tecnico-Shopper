import { Decimal } from "@prisma/client/runtime";

export default interface ProductsUpdated {
  code: number;
  name: string;
  cost_price: Decimal;
  sales_price: Decimal;
}