import db from '../config/db.js';

export const findProductById = async (global_id) => {
  const [rows] = await db.query('SELECT * FROM products WHERE global_id = ?', [global_id]);
  return rows;
};


export const insertProduct = async (product) => {

  const [existing] = await db.query(
    'SELECT id FROM products WHERE global_id = ?',
    [product.global_id]
  );

  if (existing.length > 0) return;

  const columns = Object.keys(product).join(', ');
  const placeholders = Object.keys(product).map(() => '?').join(', ');
  const values = Object.values(product);

  await db.query(`INSERT INTO products (${columns}) VALUES (${placeholders})`, values);
};


export const updateProduct = async (product) => {
  const columns = Object.keys(product)
    .filter(key => key !== 'global_id')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = Object.keys(product)
    .filter(key => key !== 'global_id')
    .map(key => product[key]);

  values.push(product.global_id);

  await db.query(`UPDATE products SET ${columns} WHERE global_id = ?`, values);
};