import { Router } from "express";
import productsRouter from "./productsRouter";
const router = Router();

router.use(productsRouter);

export default router;