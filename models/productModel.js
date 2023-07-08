'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: {
        type: Number
    },
    tags: [{
        type: String
    }],
    name: {
        type: String
    },
    description: {
        type: String
    },
    photo: {
        type: String
    },
    price: {
        type: Number
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
