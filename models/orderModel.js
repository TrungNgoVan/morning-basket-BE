'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectIdType = Schema.Types.ObjectId;

const orderStatus = {
    PENDING: "Pending",
    PLACED: "Placed",
    SHIPPED: "Shipped",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded"
}

const OrderSchema = new Schema({
    _id: {
        type: ObjectIdType
    },
    id: {
        type: Number
    },
    customerId: {
        type: Number
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
    }],
    totalPrice: {
        type: Number
    },
    shippingAddress: {
        type: String
    },
    billingAddress: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(orderStatus)
    },
    orderedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
