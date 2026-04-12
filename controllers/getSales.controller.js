import { fetchSales } from "../models/getSales.model.js";

export const getSales = async (req,res) => {

    try {
        
        const sales = await fetchSales();

        return res.status(200).json({success: true, message: 'Successfully fetched sales.',data: sales})

    } catch (error) {
        console.log('Server Error');
        return res.status(500).json({success: false, message: 'Error fetching sales.',error:error.message});
    }

}