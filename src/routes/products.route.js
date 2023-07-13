const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.post('/', controller.createProduct);

module.exports = router;
