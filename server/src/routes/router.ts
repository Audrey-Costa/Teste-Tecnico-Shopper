import { Router } from "express";
import productsRouter from "./productsRouter";
import validationRouter from "./validationRouter";
const router = Router();

router.use(productsRouter, validationRouter);

export default router;