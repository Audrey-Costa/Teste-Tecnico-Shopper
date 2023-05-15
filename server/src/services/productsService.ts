import { packs } from "@prisma/client";
import productsRepository from "../repositories/productsRepository";
import ProductsToUpdate from "../types/ProductsToUpdateType";

async function getProducts() {
  const products = await productsRepository.getProducts();
  const normalizedBigintToNumberProducts = products.map(product => {return {...product, code: Number(product.code)}});
  return normalizedBigintToNumberProducts;
}

async function updateProductSalesPrice(productsToUpdate: ProductsToUpdate[]) {
  productsToUpdate.map(async ({product_code, new_price}) => 
    {
      const bigintCode = BigInt(product_code);
      
      const isPack = await productsRepository.getPacksByPack_id(bigintCode);
      if(isPack.length > 0){
        return;
      }

      const productsInPack = await productsRepository.getProductsInPack(bigintCode);

      updateProductPackSalesPrice(productsInPack, new_price, productsToUpdate);

      await productsRepository.updateSingleProductSalesPrice(bigintCode, new_price);
    }
  );
}

function updateProductPackSalesPrice(productsInPack: packs[], new_price: number, packsToUpdate: ProductsToUpdate[]){
  if(productsInPack.length > 0){
    productsInPack.map(
      async (productInPack) => 
      {
        const packs = await productsRepository.getPacksByPack_id(productInPack.pack_id);
        let packNewPrice: number = 0;
        
        const hashMap: Map<number, number> = new Map();
        packs.map(async pack => {
          packsToUpdate.map((packToUpdate) => 
          {if(packToUpdate.product_code === Number(pack.product_id)){
            hashMap.set(
              packToUpdate.product_code, 
              (packToUpdate.new_price * Number(pack.qty)))
            }else if(packToUpdate.product_code === Number(pack.pack_id)){
              packNewPrice = packToUpdate.new_price
            }
          });
        });
        let sumProductsPackPrice = 0;
        for(let update of hashMap){
          sumProductsPackPrice += update[1];
        }

        sumProductsPackPrice = Number(sumProductsPackPrice.toFixed(2));
        
        if(sumProductsPackPrice === packNewPrice){
          await productsRepository.updatePackProductsSalesPrice(
          productInPack.pack_id, 
          packNewPrice
          );
        }
      }
    );
  };
  return;
}

const productsServices = {
  getProducts,
  updateProductSalesPrice
}

export default productsServices;