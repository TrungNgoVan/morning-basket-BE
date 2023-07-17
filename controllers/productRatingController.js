const ProductRating = require('../models/productRatingModel');

const createProductRating = async (req, res, next) => {
    try {
        const productRating = req.value.body
        const newProductRating = new ProductRating(productRating)
        await newProductRating.save()
        return res.status(201).json({
            message: `ProductRating ${newProductRating.id} created successfully`,
        })
    } catch (err) {
        next(err)
    }
}


const getProductRatings = async (req, res, next) => {
    try {
        const productRatings = await ProductRating.find({});
        if (!productRatings) {
            return res.status(404).json
        }
    } catch (err) {
        next(err);
    }
}

const getProductRatingById = async (req, res, next) => {
    try {
        const { productRatingID } = req.value.params
        const productRating = await ProductRating.findOne({ id: productRatingID })
        if (productRating === null) {
            return res.status(404).json({
                error: {
                    message: `ProductRating ${productRatingID} not found`,
                },
            })
        } else {
            return res.status(200).json({ productRating })
        }
    } catch (err) {
        next(err)
    }
}

const updateProductRating = async (req, res, next) => {
    try {
        const { productRatingID } = req.value.params
        const productRating = await ProductRating.find({ id: productRatingID })
        if (productRating === null) {
            return res.status(404).json({
                error: {
                    message: `ProductRating ${productRatingID} not found`,
                },
            })
        } else {
            const newProductRating = req.value.body
            await ProductRating.findOneAndUpdate({ id: productRatingID }, newProductRating, {
                updatedAt: Date.now(),
            })
            return res.status(200).json({
                message: `ProductRating ${productRating.id} updated successfully`,
            })
        }
    } catch (err) {
        next(err)
    }
}

const deleteProductRating = async (req, res, next) => {
    try {
        const { productRatingID } = req.value.params
        const productRating = await ProductRating.findOneAndDelete({ id: productRatingID })
        if (productRating === null) {
            return res.status(404).json({
                error: {
                    message: `ProductRating ${productRatingID} not found. Not deleted`,
                },
            })
        } else {
            return res.status(200).json({
                message: `ProductRating ${productRating.id} deleted`,
            })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createProductRating,
    deleteProductRating,
    getProductRatingById,
    getProductRatings,
    updateProductRating
}
