import { Router } from "express";
import { getProducts } from "../controllers/productsController";

const productsRouter = Router();

productsRouter.get("/products", getProducts)
productsRouter.put("/products", (req, res) => {return res.send("update products")})

export default productsRouter;