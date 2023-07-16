'use strict'

const mongoose = require('mongoose')
const { getNextSequenceValue } = require('../helpers/mongoHelper')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    id: {
        type: Number,
        default: null
    },
    barcode: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    photo: {
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

ProductSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

ProductSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            this.id = await getNextSequenceValue("product");
        }
        next();
    } catch (err) {
        next(err)
    }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
