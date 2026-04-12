import db from '../config/db.js';

export const insertSales = async (sale) => {
  
    const connection = await db.getConnection();

  try {
    
    await connection.beginTransaction();

    const [existingSale] = await connection.query(
      `SELECT id FROM sales WHERE global_id = ?`,
      [sale.global_id]
    );


    if (existingSale.length > 0) {
      return {
        success: true,
        message: 'Sale already exists',
        saleId: existingSale[0].id
      };
    }



    const [saleResult] = await connection.query(
      `INSERT INTO sales 
      (global_id,user_id,user_global_id, total_amount, amount_received, change_amount, status, voided_at, voided_by, reason, payment_type, created_at,is_synced)
      VALUES (?,?, ?,?, ?, ?, ?, ?,?,?,?,?,?)`,
      [
        sale.global_id,
        sale.user_id,
        sale.user_global_id,
        sale.total_amount,
        sale.amount_received,
        sale.change_amount,
        sale.status,
        sale.voided_at,
        sale.voided_by,
        sale.reason,
        sale.payment_type,
        sale.created_at,
        1
        
      ]
    );


    
    const insertedSaleId = saleResult.insertId;
    console.log(saleResult)


    for (const item of sale.items) {

      console.log('=========================');
      console.log(item)
      console.log('=========================');


      const [productRows] = await connection.query(
        `SELECT id FROM products WHERE global_id = ?`,
        [item.product_global_id]
      );


      if (productRows.length === 0) {
        throw new Error(`Product not found: ${item.product_global_id}`);
      }


      const productId = productRows[0].id


      const [existingItem] = await connection.query(
        `SELECT id FROM sale_items WHERE global_id = ?`,
        [item.global_id]
      );


      if (existingItem.length > 0) continue;


        await connection.query(
          `INSERT INTO sale_items 
          (global_id, sale_id, sale_global_id, product_id,product_global_id, product_name, price, quantity, created_at,is_synced)
          VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?)`,
          [
            item.global_id,
            insertedSaleId,
            sale.global_id,
            productId,
            item.product_global_id,
            item.product_name,
            item.price,
            item.quantity,
            item.created_at,
            1
            
          ]
        );


        await connection.query(
          `UPDATE products 
          SET stock = stock - ? 
          WHERE id = ? AND stock >= ?`,
          [item.quantity, productId, item.quantity]
        );
    }

    await connection.commit();

    return { success: true,message: 'Successfully inserted sales into the database', saleId: insertedSaleId };

  } catch (error) {
    console.log('Server Error', error);
    await connection.rollback();
    throw error;
    
  } finally {
    connection.release();
  }
};











export const updateSaleStatusDB = async (sale) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();


    await connection.query(
      `UPDATE sales 
       SET status=?, voided_at=?, voided_by=?, reason=?, is_synced=? 
       WHERE global_id= ?`,
      [
        sale.status,
        sale.voided_at,
        sale.voided_by,
        sale.reason,
        1,
        sale.global_id
      ]
    );

    
  const [items] = await connection.query(
    `SELECT product_global_id, quantity 
    FROM sale_items 
    WHERE sale_global_id = ?`,
    [sale.global_id]
  );

  
  for (const item of items) {

    const [productRows] = await connection.query(
    `SELECT id FROM products WHERE global_id = ?`,
    [item.product_global_id]
  );

  if (productRows.length === 0) {
    throw new Error(`Product not found: ${item.product_global_id}`);
  }

  const productId = productRows[0].id;


      await connection.query(
        `UPDATE products 
        SET stock = stock + ? 
        WHERE id = ?`,
        [item.quantity, productId]
      );
    }

        await connection.commit();

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
  };