'use strict'

const Product = require('../models/productModel')

const createProduct = async (req, res, next) => {
    try {
        const product = req.body
        const newProduct = new Product(product)
        await newProduct.save()
        return res.status(201).json({
            message: `Product ${newProduct.id} created successfully`,
        })
    } catch (err) {
        next(err)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        return res.status(200).json({ data: products })
    } catch (err) {
        next(err)
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params
        const product = await Product.findOne({ id: productId })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `Product ${productId} not found`,
                },
            })
        } else {
            return res.status(200).json({ data: product })
        }
    } catch (err) {
        next(err)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params
        const product = await Product.find({ id: productId })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `Product ${productId} not found`,
                },
            })
        } else {
            const newProduct = req.body
            await Product.findOneAndUpdate({ id: productId }, newProduct, {
                updatedAt: Date.now(),
            })
            return res.status(200).json({
                message: `Product ${product.id} updated successfully`,
            })
        }
    } catch (err) {
        next(err)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params
        const product = await Product.findOneAndDelete({ id: productId })
        if (product === null) {
            return res.status(404).json({
                error: {
                    message: `Product ${productId} not found. Not deleted`,
                },
            })
        } else {
            return res.status(200).json({
                message: `Product ${product.id} deleted`,
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
