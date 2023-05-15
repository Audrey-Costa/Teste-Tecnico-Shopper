import { Router } from "express";
import { getProducts, updateProductSalesPrice } from "../controllers/productsController";

const productsRouter = Router();

productsRouter.get("/products", getProducts)
productsRouter.put("/products", updateProductSalesPrice)

export default productsRouter;