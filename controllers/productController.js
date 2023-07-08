'use strict'

const Product = require('../models/productModel');

const addProduct = async (req, res, next) => {
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

module.exports = {
    addProduct,
    getProducts
}
