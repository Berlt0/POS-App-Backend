import db from '../config/db.js'
import { fetchProducts } from '../models/getProduct.model.js'

export const fetchProduct = async (req,res)  => {

    try{

        const products = await fetchProducts();
        res.status(200).json({success:true, message: "Fetching product successful", data: products});

    }catch(error){
        console.log("Error fetching products:", error);
        res.status(500).json({success: false, message: `Server Error`});
        
    }

}