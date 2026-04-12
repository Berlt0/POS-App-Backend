import { syncProductArchives ,deleteProduct, fetchProductArchives} from "../models/productArchives.model.js";

export const syncArchivesController = async (req, res) => {
    
    try {

        const archive = req.body;

        if(!archive) return res.status(400).json({success: false, message: 'Invalid data'});

        const result = await syncProductArchives(archive);

        res.status(200).json({success: true, message: 'Product archive synced successfully', data: result.data});


    } catch (error) {
        console.error('Sync Product Archive Error:', error);

        res.status(500).json({
          success:false,
          message: 'Failed to sync product archive in the database',
          error: error.message
        });
    }

}


export const deleteProductController = async (req, res) => {

    const { id } = req.params;
    if(!id) return res.status(400).json({success: false, message: 'Product ID is required'});

    try{
        
        const result = await deleteProduct(id);

        if(result.success && result.data.affectedRows > 0){
            res.status(200).json({success: true, message: 'Product deleted successfully', data: result.data});
        }else{
            res.status(400).json({success: false, message: 'Failed to delete product', error: result.error});
        }

    }catch(error){
        console.error('Delete Product Error:', error);
        res.status(500).json({success: false, message: 'Failed to delete product', error: error.message});
    }

}


export const getArchivesController = async (req, res) => {
  try {
    const archives = await fetchProductArchives();

    res.status(200).json({
      success: true,
      message: "Archives fetched successfully",
      data: archives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch archives",
      error: error.message,
    });
  }
};