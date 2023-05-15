import { Request, Response } from "express";
import productsServices from "../services/productsService";
import ProductsUpdated from "../types/ProductsUpdatedType";

export async function getProducts(req: Request, res: Response){
  const products = await productsServices.getProducts();

  return res.status(200).json(products);
}

export async function updateProductSalesPrice(req: Request, res: Response) {
  const productsToUpdate = req.body;

  const productsUpdated: ProductsUpdated[] = await productsServices.updateProductSalesPrice(productsToUpdate);

  return res.status(200).json(productsUpdated);
}