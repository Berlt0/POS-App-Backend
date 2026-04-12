import db from "../config/db.js";

export const syncProductArchives = async (archive) => {
    
    const connection = await db.getConnection();

    try {
        
        await connection.beginTransaction();

        const [archives] = await connection.query(`
            INSERT INTO products_archive
                (global_id, name, price, stock, stock_unit, cost, category, barcode, 
                low_stock_alert, description, image_path, createdAt, updated_at, deleted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                archive.global_id,
                archive.name,
                archive.price,
                archive.stock,
                archive.stock_unit,
                archive.cost,
                archive.category,
                archive.barcode,
                archive.low_stock_alert,
                archive.description,
                archive.image_path,
                archive.createdAt,
                archive.updated_at,
                archive.deleted_at
            ]);
            
        await connection.commit();
        return { success: true, message: 'Successfully synced product archive to the database', data: archives };


    } catch (error) {
        
        await connection.rollback();
        console.log('Server Error', error);
        
    }finally{
        connection.release();
    }
    
}

export const deleteProduct = async (global_id) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();


        const [result] = await connection.query(`
            DELETE FROM products WHERE global_id = ?
        `, [global_id]);

        await connection.commit();
        return { success: true, message: 'Product deleted successfully', data: result.affectedRows };

    } catch (error) {

        await connection.rollback();
        console.error('Delete Product Error:', error);
        return { success: false, message: 'Failed to delete product', error: error.message };

    } finally {
        connection.release();
    }
}



export const fetchProductArchives = async () => {
  const connection = await db.getConnection();

  try {
    const [archives] = await connection.query(
      "SELECT * FROM products_archive"
    );
    return archives;
  } catch (error) {
    console.log("Server Error:", error);
    throw error;
  } finally {
    connection.release();
  }
};