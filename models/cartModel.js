'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectIdType = Schema.Types.ObjectId;

const cartStatus = {
    NEW: 'New',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    EXPIRED: 'Expired',
    EMPTY: 'Empty',
};

const CartSchema = new Schema({
    _id: {
        type: ObjectIdType
    },
    id: {
        type: String
    },
    customerId: {
        type: String
    },
    items: [{
        itemId: {
            type: String
        },
        name: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        }
    }]
    ,
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: Object.values(cartStatus),
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
