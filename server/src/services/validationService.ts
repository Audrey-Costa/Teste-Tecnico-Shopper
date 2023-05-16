import { Readable } from "stream";
import readline from "readline";
import ProductToUpdate from "../types/ProductsToUpdateType";
import productsRepository from "../repositories/productsRepository";
import ProductInputValidate from "../types/ProductInputValidate";
import productsServices from "./productsService";

async function validation(buffer: any) {
  const readableFile = new Readable();
  readableFile.push(buffer);
  readableFile.push(null);
  
  const productsLine = readline.createInterface({
    input: readableFile
  })

  const products: ProductToUpdate[] = [];
  for await (let line of productsLine){
    const columns = line.split(",");
    if(columns[0] === 'product_code'){
      continue;
    }
    products.push({
      product_code: Number(columns[0]),
      new_price: Number(columns[1])
    });
  }
  
  const productsValided: ProductInputValidate[] = []
  for await(let product of products){
    try {      
      const packRegistred = await productsRepository.getPacksByPack_id(
        BigInt(product.product_code)
      )
      if(packRegistred.length > 0){
        const validityVerificated = await productsServices.verifyIfNewPricePackIsValid(packRegistred[0], products);
  
        if(validityVerificated === "New price is below cost price!"){
          productsValided.push(
            {
              product_code: product.product_code, 
              new_price: product.new_price, 
              message:"New price is below cost price!"
            }
          );
        }else if(validityVerificated === "Adjustment different from 10%!"){
          productsValided.push(
            {
              product_code: product.product_code, 
              new_price: product.new_price, 
              message:"Adjustment different from 10%!"
            }
          );
        }else if(validityVerificated.sumProductsPackPrice !== validityVerificated.packNewPrice){
          productsValided.push(
            {
              product_code: product.product_code, 
              new_price: product.new_price, 
              message:"The bundle price differs from the price of the individual products!"
            }
          );
        }
      }else{

      await productsRepository.getProductsBycode(BigInt(product.product_code));
      }

    } catch (error) {
      productsValided.push(
        {
          product_code: product.product_code, 
          new_price: product.new_price, 
          message: `Product_code: ${product.product_code} not valid. Product not found!`
        }
      ) ;
    }
  }
  
  return productsValided;
}

const validationService = {
  validation
}

export default validationService;