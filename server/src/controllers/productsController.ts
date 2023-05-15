import { Request, Response } from "express";
import productsServices from "../services/productsService";

export async function getProducts(req: Request, res: Response){
  const products = await productsServices.getProducts();

  return res.status(200).json(products);
}

export async function updateProductSalesPrice(req: Request, res: Response) {
  const productsToUpdate = req.body;

  await productsServices.updateProductSalesPrice(productsToUpdate);

  return res.sendStatus(200);
}