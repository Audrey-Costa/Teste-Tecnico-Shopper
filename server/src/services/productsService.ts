import { packs } from "@prisma/client";
import productsRepository from "../repositories/productsRepository";
import ProductsToUpdate from "../types/ProductsToUpdateType";
import ProductsUpdated from "../types/ProductsUpdatedType";

async function getProducts() {
  const products = await productsRepository.getProducts();
  const normalizedBigintToNumberProducts = products.map(product => {return {...product, code: Number(product.code)}});
  return normalizedBigintToNumberProducts;
}

async function updateProductSalesPrice(productsToUpdate: ProductsToUpdate[]): Promise<ProductsUpdated[]> {
  const productsUpdated: ProductsUpdated[] = [];
  for(const {product_code, new_price} of productsToUpdate){
    const bigintCode = BigInt(product_code);
    
    const isPack = await productsRepository.getPacksByPack_id(bigintCode);
    if(isPack.length > 0){
      continue;
    }
    
    const productsInPack = await productsRepository.getProductsInPack(bigintCode);

    if(productsInPack.length > 0){
      const packUpdate = await updateProductPackSalesPrice(productsInPack, productsToUpdate);
      
      if(packUpdate){
        productsUpdated.push({...packUpdate, code: Number(packUpdate.code)});
      }else{
        continue;
      }
    }

    const productUpdated = await productsRepository.updateSingleProductSalesPrice(bigintCode, new_price);

    if(productUpdated){
      productsUpdated.push({...productUpdated, code: Number(productUpdated.code)});
    }
  }
  return productsUpdated;
}

async function updateProductPackSalesPrice(productsInPack: packs[], packsToUpdate: ProductsToUpdate[]){
  for (const productInPack of productsInPack){
    const packs = await productsRepository.getPacksByPack_id(productInPack.pack_id);
    let packNewPrice: number = 0;
    
    const hashMap: Map<number, number> = new Map();
    for (const pack of packs){
      for (const packToUpdate of packsToUpdate){
        if(packToUpdate.product_code === Number(pack.product_id)){
        hashMap.set(
          packToUpdate.product_code, 
          (packToUpdate.new_price * Number(pack.qty)))
        }else if(packToUpdate.product_code === Number(pack.pack_id)){
          packNewPrice = packToUpdate.new_price
        }
      }
    }
    let sumProductsPackPrice = 0;
    for(let update of hashMap){
      sumProductsPackPrice += update[1];
    }

    sumProductsPackPrice = Number(sumProductsPackPrice.toFixed(2));
    
    if(sumProductsPackPrice === packNewPrice){
      const packUpdated = await productsRepository.updatePackProductsSalesPrice(
      productInPack.pack_id, 
      packNewPrice
      );
      return packUpdated;
    }
  }
  return null;
}

const productsServices = {
  getProducts,
  updateProductSalesPrice
}

export default productsServices;