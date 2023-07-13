const db = require('./db.service');

const getAllProducts = async () => {
    const { data, error } = await db
        .from('products')
        .select()
    if (error) {
        return { error: error.message }
    }
    return data;
}

const getProductById = async (id) => {
    const { data, error } = await db
        .from('products')
        .select()
        .eq('id', id)
    if (error) {
        return { error: error.message }
    }
    return data;
}

const updateProduct = async (id, product) => {
    const { error } = await db
        .from('products')
        .update({
            name: product.name,
            description: product.description,
            price: product.price,
        })
        .eq('id', id)
    if (error) {
        return { error: error.message }
    }
    return `Product ${id} updated`;
}

const deleteProduct = async (id) => {
    const { error } = await db
        .from('products')
        .delete()
        .eq('id', id)
    if (error) {
        return { error: error.message }
    }
    return `Product ${id} deleted`;
}

const createProduct = async (product) => {
    const { data, error } = await db
        .from('products')
        .insert({
            name: product.name,
            description: product.description,
            price: product.price,
        })
    if (error) {
        return { error: error.message }
    }
    return `Product created at ${data.id}`;
}

module.exports = {
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProduct
}
