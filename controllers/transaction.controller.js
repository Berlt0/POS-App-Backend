import { insertTransaction } from "../models/transaction.model.js";

export const syncTransaction = async (req,res) => {

    try {
        
        const transaction = req.body;

        if(!transaction) return res.status(400).json({success: true, message: 'Invalid data'});
        
        const result = await insertTransaction(transaction);

        res.status(200).json({success: true, message: 'Transaction synced successfully', id: result.id})

    } catch (error) {
        
    console.error('Sync Sale Error:', error);

    res.status(500).json({
      success:false,
      message: 'Failed to sync transaction in the database',
      error: error.message
    });

    }

}