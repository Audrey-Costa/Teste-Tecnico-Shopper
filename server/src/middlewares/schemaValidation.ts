import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ProductToUpdate from "../types/ProductsToUpdateType";
import { Readable } from "stream";
import readline from "readline";

const schemaValidation = (schema: Joi.ObjectSchema<ProductToUpdate>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const readableFile = new Readable();
    readableFile.push(req.file?.buffer);
    readableFile.push(null);
    const productsLine = readline.createInterface({
      input: readableFile
    })
    const errors: string[] = [];
    const products: ProductToUpdate[] = [];
    for await(let line of productsLine){
      const columns = line.split(",");
      if(columns[0] === 'product_code'){
        continue;
      }
      if(Number(columns[1]) === 0){
        errors.push("new_price don't can be empty")
      }
      products.push({
        product_code: Number(columns[0]),
        new_price: Number(columns[1])
      });
    }
    console.log(products)
    for(let product of products){
      const { error } = schema.validate(product, {abortEarly: false, convert: false});
      if(error){
        errors.push(error.details[0].message);
      }
    }
    if (errors.length > 0) {
      throw {type: "Bad Request", message: errors};
    }
    next();
  };
};
  
  export default schemaValidation;