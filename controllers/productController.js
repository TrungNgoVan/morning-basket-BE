'use strict'

const Product = require('../models/productModel')

const createProduct = async (req, res, next) => {
    try {
        const product = req.value.body
        const newProduct = new Product(product)
        await newProduct.save()
        return res.status(201).json({
            message: `PRODUCT_CREATE:SUCCESS_${newProduct.id}`,
        })
    } catch (err) {
        next(err)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        return res.status(200).json({ products })
    } catch (err) {
        next(err)
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { productID } = req.value.params
        const product = await Product.findOne({ id: productID })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `PRODUCT_GET:NOT_FOUND_${productID}`,
                },
            })
        } else {
            return res.status(200).json({ product })
        }
    } catch (err) {
        next(err)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { productID } = req.value.params
        const product = await Product.find({ id: productID })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `PRODUCT_UPDATE:NOT_FOUND_${productID}`,
                },
            })
        } else {
            const newProduct = req.value.body
            await Product.findOneAndUpdate({ id: productID }, newProduct, {
                updatedAt: Date.now(),
            })
            return res.status(200).json({
                message: `PRODUCT_UPDATE:SUCCESS_${product.id}`,
            })
        }
    } catch (err) {
        next(err)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { productID } = req.value.params
        const product = await Product.findOneAndDelete({ id: productID })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `PRODUCT_DELETE:NOT_FOUND_${productID}`,
                },
            })
        } else {
            return res.status(200).json({
                message: `PRODUCT_DELETE:SUCCESS_${product.id}`,
            })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
}
