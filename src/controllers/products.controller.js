const service = require('../services/products.service');

async function getAllProducts(req, res) {
    try {
        res.json(await service.getAllProducts());
    }
    catch (err) {
        console.log(`Error while getting the products `, err.message);
    }
}

async function getProductById(req, res) {
    try {
        res.json(await service.getProductById(req.params.id));
    }
    catch (err) {
        console.log(`Error while getting the product ${res.params.id}`, err.message);
    }
}

async function updateProduct(req, res) {
    try {
        res.json(await service.updateProduct(req.params.id, req.body));
    }
    catch (err) {
        console.log(`Error while updating the product ${res.params.id}`, err.message);
    }
}

async function deleteProduct(req, res) {
    try {
        res.json(await service.deleteProduct(req.params.id));
    }
    catch (err) {
        console.log(`Error while deleting the product ${res.params.id}`, err.message);
    }
}

async function createProduct(req, res) {
    try {
        res.json(await service.createProduct(req.body));
    }
    catch (err) {
        console.log(`Error while creating the product`, err.message);
    }
}
module.exports = {
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProduct
}
