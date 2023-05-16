import Joi from "joi";
import ProductToUpdate from "../types/ProductsToUpdateType";

export const validationSchema = Joi.object<ProductToUpdate>({
  product_code: Joi.number().required(),
  new_price: Joi.number().precision(2).required()
});