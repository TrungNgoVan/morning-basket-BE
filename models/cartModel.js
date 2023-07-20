'use strict'

const mongoose = require('mongoose')
const { getNextSequenceValue } = require('../helpers/mongoHelper')

const Schema = mongoose.Schema

const cartStatus = {
    NEW: 'new',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    EXPIRED: 'expired',
    EMPTY: 'empty',
}

const CartSchema = new Schema({
    id: {
        type: Number,
        default: null,
    },
    customerId: {
        type: Number,
    },
    items: [
        {
            itemId: {
                type: Number,
            },
            name: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
        },
    ],
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: Object.values(cartStatus),
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

CartSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

CartSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            this.id = await getNextSequenceValue('cart')
        }
        next()
    } catch (err) {
        next(err)
    }
})

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart
