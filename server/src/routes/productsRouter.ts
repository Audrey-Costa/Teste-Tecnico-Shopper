import { Router } from "express";

const productsRouter = Router();

productsRouter.get("/products", (req, res) => {return res.send("get products")})
productsRouter.put("/products", (req, res) => {return res.send("update products")})

export default productsRouter;