import db from "../config/db.js";

export const fetchTransaction = async () => {
    
    const connection = await db.getConnection();

    try {
        
        const [transactions] = await connection.query('SELECT * FROM transaction_history');

        return transactions;

    } catch (error) {
        
        console.log('Server Error', error);
        throw error;

    }finally{
        connection.release();
    }
}