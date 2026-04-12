import db from "../config/db.js";

export const fetchSales =  async () => {
  
    const connection = await db.getConnection();

    try {
        


        const [sales] = await connection.query('SELECT * FROM sales');
        const result = [];

        for(const sale of sales){
            const [items] = await connection.query('SELECT * FROM sale_items WHERE sale_global_id = ?',[sale.global_id]);

            result.push({
                ...sale,
                items,
            })
        }


        return result;

    } catch (error) {
        
        console.log('Server error: ', error);
        throw error;

    }finally{
        connection.release();
    }


}; 