import db from "../config/db.js";

export const insertTransaction = async (transaction) => {

    const connection = await db.getConnection();

    try {
        
        await connection.beginTransaction();

        const [saleRows] = await connection.query(
            'SELECT id FROM sales WHERE global_id = ?',
            [transaction.entity_global_id]
            );

            if (!saleRows.length) {
                
                await connection.rollback();
                return { success: false, message: 'Sale not found yet' };

            }

            const saleId = saleRows[0].id;

        const [transactions] = await connection.query(`INSERT INTO transaction_history 
            (global_id, user_id, user_global_id, action, entity_type, entity_id, entity_global_id, description, created_at, is_synced)
            VALUES(?,?,?,?,?,?,?,?,?,?)`, [

            transaction.global_id,
            transaction.user_id,
            transaction.user_global_id,
            transaction.action,
            transaction.entity_type,
            saleId,
            transaction.entity_global_id,
            transaction.description,
            transaction.created_at,
            transaction.is_synced

            ]);

        const insertedId = transactions.insertId;

        await connection.commit();
        
        return {success: true, message: 'Successfully inserted transaction in the database', id: insertedId}

    } catch (error) {
        
        await connection.rollback();
        console.log('Server Error', error);
        return { success: false, message: 'Failed to insert transaction', error };
    }finally{
        connection.release();
    }


}