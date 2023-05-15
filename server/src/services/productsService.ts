import { packs } from "@prisma/client";
import productsRepository from "../repositories/productsRepository";
import ProductToUpdate from "../types/ProductsToUpdateType";
import ProductUpdated from "../types/ProductsUpdatedType";

async function getProducts(): Promise<ProductUpdated[]> {
  const products = await productsRepository.getProducts();
  const normalizedBigintToNumberProducts = products.map(product => {return {...product, code: Number(product.code)}});
  return normalizedBigintToNumberProducts;
}

async function updateProductSalesPrice(productsToUpdate: ProductToUpdate[]): Promise<ProductUpdated[]> {
  const productsUpdated: ProductUpdated[] = [];
  for(const {product_code, new_price} of productsToUpdate){
    const bigintCode = BigInt(product_code);
    
    const isPack = await productsRepository.getPacksByPack_id(bigintCode);
    if(isPack.length > 0){
      continue;
    }
    
    const productsInPack = await productsRepository.getProductsInPack(bigintCode);
    let productIsInPack: boolean = false;

    if(productsInPack.length > 0){
      productIsInPack = true;
      const packUpdate = await updateProductPackSalesPrice(productsInPack, productsToUpdate);
      
      if(typeof packUpdate === "string"){
        throw {type: "Bad Request", message: packUpdate}
      }

      if(packUpdate){
        productsUpdated.push({...packUpdate, code: Number(packUpdate.code)});
      }else{
        continue;
      }
    }

    if(await verifyIfTheNewPriceIsBiggerThanCost(bigintCode, new_price)){
      if(productIsInPack){
        
      }
      const productUpdated = await productsRepository.updateSingleProductSalesPrice(bigintCode, new_price);

      if(productUpdated){
        productsUpdated.push({...productUpdated, code: Number(productUpdated.code)});
      }
    }

  }
  return productsUpdated;
}

async function updateProductPackSalesPrice(productsInPack: packs[], productsToUpdate: ProductToUpdate[]){
  for (const productInPack of productsInPack){
    const packs = await productsRepository.getPacksByPack_id(productInPack.pack_id);

    let packNewPrice: number = 0;
    const hashMap: Map<number, number> = new Map();
    for (const pack of packs){
      for (const productToUpdate of productsToUpdate){
        if(productToUpdate.product_code === Number(pack.product_id)){
        hashMap.set(
          productToUpdate.product_code, 
          (productToUpdate.new_price * Number(pack.qty)));
        }else if(productToUpdate.product_code === Number(pack.pack_id)){
          packNewPrice = productToUpdate.new_price;
        }
      }
    }

    const products = [];
    for(let code of hashMap.keys()){
      const product = await productsRepository.getProductsBycode(BigInt(code))
      products.push(product)
    }

    for(let product of products){
      let new_price: number = 0;
      let i = 0;
      while(!new_price){
        if(productsToUpdate[i].product_code === Number(product.code)){
          new_price = productsToUpdate[i].new_price
        }
        i++
      }
      if(Number(product.cost_price) > new_price){
        return "New price below cost price!";
      }

      if(Math.round(Math.abs((new_price - Number(product.sales_price))/Number(product.sales_price)) * 100)!== 10){
        return "Adjustment different from 10%!";
      }
    }


    let sumProductsPackPrice = 0;
    for(let update of hashMap){
      sumProductsPackPrice += update[1];
    }

    sumProductsPackPrice = Number(sumProductsPackPrice.toFixed(2));
    if(sumProductsPackPrice === packNewPrice){
      if(await verifyIfTheNewPriceIsBiggerThanCost(productInPack.pack_id, packNewPrice)){
        const packUpdated = await productsRepository.updatePackProductsSalesPrice(
        productInPack.pack_id, 
        packNewPrice
        );
        return packUpdated;
      }
    }else{
      return "The bundle price differs from the price of the individual products!";
    }
  }
}

async function verifyIfTheNewPriceIsBiggerThanCost(code: bigint, new_price: number): Promise<boolean>{
  const product = await productsRepository.getProductsBycode(code);

  if(Number(product.cost_price) > new_price){
    return false;
  }
  return true;
}

const productsServices = {
  getProducts,
  updateProductSalesPrice
}

export default productsServices;