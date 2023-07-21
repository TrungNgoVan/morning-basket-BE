'use strict'

const mongoose = require('mongoose')
const { getNextSequenceValue } = require('../helpers/mongoHelper')
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    id: {
        type: Number,
        default: null,
    },
    mail: {
        type: String,
    },
    name: {
        type: String,
    },
    message: {
        type: String,
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

ContactSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

ContactSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            this.id = await getNextSequenceValue('contact')
        }
        next()
    } catch (err) {
        next(err)
    }
})

const Contact = mongoose.model('Contact', ContactSchema)

module.exports = Contact
