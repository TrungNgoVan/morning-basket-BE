'use strict'

const Product = require('../models/productModel');

const createProduct = async (req, res, next) => {
    try {
        const product = req.body;
        const newProduct = new Product(product);
        await newProduct.save();
        return res.status(201).json({
            message: 'Add successfully'
        })
    } catch (err) {
        next(err);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { productID } = req.value.params;
        const product = await Product.findByIdAndDelete(productID);
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: "Product not exist"
                }
            })
        } else {
            return res.status(200).json({
                message: "Delete success"
            })
        }
    } catch (err) {
        next(err);
    }
}

const getProductByID = async (req, res, next) => {
    try {
        const { productID } = req.value.params;
        console.log(productID);
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({
                message: "Product not exist"
            })
        } else {
            return res.status(200).json({
                product
            })
        }
    } catch (err) {
        next(err);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            products
        })
    } catch (err) {
        next(err);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { productID } = req.value.params;
        const product = Product.findById(productID);
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: "Product not exist"
                }
            })
        } else {
            const newProduct = req.value.body;
            await Product.findByIdAndUpdate(productID, newProduct, { updateAt: Date.now() });
            return res.status(200).json({
                message: "Update product success"
            })
        }

    } catch (err) {
        next(err);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProductByID,
    getProducts,
    updateProduct
}
