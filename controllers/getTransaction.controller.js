import {fetchTransaction} from "../models/getTransaction.model.js";

export const getTransaction = async (req,res) => {
    
    try {
        
        const transactions = await fetchTransaction();

        return res.status(200).json({succes: true, message: 'Successfully fetched transactions', data: transactions});
        

    } catch (error) {
        console.log('Server Error');
        res.status(500).json({succes: false, message: 'Error fetching transaction records'});
    }
    

}