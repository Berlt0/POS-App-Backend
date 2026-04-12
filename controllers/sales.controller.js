import { insertSales, updateSaleStatusDB } from '../models/sales.model.js';

export const syncSale = async (req, res) => {
  try {
    const sale = req.body;
    

    if (!sale || !Array.isArray(sale.items) || sale.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid sale data' });
    }

    const result = await insertSales(sale);

    res.status(200).json({
      success:true,
      message: 'Sale synced successfully in the database',
      saleId: result.saleId
    });

  } catch (error) {
    console.error('Sync Sale Error:', error);

    res.status(500).json({
      success:false,
      message: 'Failed to sync sale in the database',
      error: error.message
    });
  }
};



export const updateSaleStatus = async (req, res) => {
  try {
    const sale = req.body;

    await updateSaleStatusDB(sale);

    res.status(200).json({
      success: true,
      message: 'Sale status updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};