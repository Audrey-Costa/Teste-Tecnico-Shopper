import prisma from "../database/prismaClient";

async function getProducts() {
  try {
    const products = await prisma.products.findMany();
    return products;
  } catch (error) {
    throw {type: "Not Found", message: "Products not found!"};
  }
}

const productsRepository = {
  getProducts
}

export default productsRepository;