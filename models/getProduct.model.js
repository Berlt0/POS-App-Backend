import db from '../config/db.js';

export const fetchProducts = async () => {

    const [products] = await db.query('SELECT * FROM products');
    return products;

}