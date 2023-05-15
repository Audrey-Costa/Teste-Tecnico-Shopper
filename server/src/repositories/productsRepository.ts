import prisma from "../database/prismaClient";

async function getProducts() {
  const products = await prisma.products.findMany();

  if(products.length > 0){
    return products;
  }
  throw {type: "Not Found", message: "Products not found!"};
}

async function getPackProducts() {
  const packProducts = await prisma.packs.findMany();

  return packProducts;
}

async function getPacksByPack_id(pack_id: bigint) {
  const pack = await prisma.packs.findMany({
    where:{
      pack_id
    }
  });

  return pack;
}

async function getProductsBycode(code: bigint) {
  const product = await prisma.products.findUnique({
    where: {code}
  });

  if(product){
    return product;
  }
  throw {type: "Not Found", message: "Product not found!"};
}

async function getProductsInPack(code: bigint) {
  const products = await prisma.packs.findMany({
    where: {product_id: code}
  });

  return products;
}

async function updateSingleProductSalesPrice(code: bigint, sales_price: number) {
  const product = await prisma.products.update({
    data: {sales_price},
    where: {code}
  });
  
  return product;
}

async function updatePackProductsSalesPrice(pack_id: bigint, sales_price: number) {
  const pack = await prisma.products.update({
    data: {sales_price},
    where: {code: pack_id}
  });

  return pack;
}

const productsRepository = {
  getProducts,
  getPackProducts,
  getPacksByPack_id,
  getProductsBycode,
  getProductsInPack,
  updateSingleProductSalesPrice,
  updatePackProductsSalesPrice
}

export default productsRepository;