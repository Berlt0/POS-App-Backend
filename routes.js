import express from 'express';
import { syncProduct } from './controllers/updateProduct.controller.js';
import { fetchProduct } from './controllers/getProduct.controller.js';
import { syncSale,updateSaleStatus } from './controllers/sales.controller.js';
import { getUsers, syncUser } from './controllers/user.controller.js';
import { syncTransaction } from './controllers/transaction.controller.js';
import { getSales } from './controllers/getSales.controller.js';
import { getTransaction } from './controllers/getTransaction.controller.js';
import { syncArchivesController, deleteProductController, getArchivesController } from './controllers/productArchives.controller.js';
import { updateProduct } from './models/updateProduct.model.js';

const router = express.Router();


// GET

router.get('/archives', getArchivesController);
router.get('/sales', getSales,updateProduct);
router.get('/transaction', getTransaction);
router.get('/products',fetchProduct);
router.get('/users', getUsers);


// POST

router.post('/products', async (req, res) => {
  try {
    const status = await syncProduct(req.body);
    res.json({ status });
    console.log('Product routes loaded');
    console.log('POST /sync/products hit', req.body);
  } catch (error) {
    console.error('Error syncing product:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/archives', syncArchivesController);
router.post('/transaction', syncTransaction)
router.post('/sales', syncSale);
router.post('/users', syncUser);

//DELETE

router.delete('/products/:id',deleteProductController);

// UPDATE

router.put('/sales/status', updateSaleStatus);

export default router;

