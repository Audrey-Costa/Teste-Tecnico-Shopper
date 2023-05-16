import { Router } from "express";
import { validation } from "../controllers/validationController";
import multerConfig from "../utils/multer";
import schemaValidation from "../middlewares/schemaValidation";
import { validationSchema } from "../schema/validationSchema";

const validationRouter = Router();

validationRouter.post("/validation", multerConfig.single("file"), schemaValidation(validationSchema), validation);

export default validationRouter;