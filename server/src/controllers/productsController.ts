import { Request, Response } from "express";
import productsServices from "../services/productsService";

export async function getProducts(req: Request, res: Response){
  const products = await productsServices.getProducts();
  console.log(products)
  return res.status(200).send(products);
}