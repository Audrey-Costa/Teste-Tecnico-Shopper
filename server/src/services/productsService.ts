import productsRepository from "../repositories/productsRepository";

async function getProducts() {
  const products = await productsRepository.getProducts();
  const normalizedProducts = products.map(product => {return {...product, code: Number(product.code)}})
  return normalizedProducts;
}

const productsServices = {
  getProducts
}

export default productsServices;