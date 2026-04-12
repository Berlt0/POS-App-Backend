import { findProductById, insertProduct, updateProduct } from '../models/updateProduct.model.js'

export const syncProduct = async (product) => {
  if (!product.global_id) throw new Error('Product ID is missing');

  const existing = await findProductById(product.global_id);

  if (existing.length === 0) {
    await insertProduct(product);
    return 'created';
  } else {
    await updateProduct(product);
    return 'updated';
  }
};

