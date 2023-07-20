const Order = require('../models/orderModel')

const createOrder = async (req, res, next) => {
    try {
        const order = req.value.body
        const newOrder = new Order(order)
        await newOrder.save()
        return res.status(200).json({
            message: 'Create order success',
            order: order,
        })
    } catch (err) {
        next(err)
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const { orderID } = req.value.params
        const order = await Order.findOneAndDelete({ id: orderID })
        if (!order) {
            return res.status(404).json({
                error: {
                    message: 'Order not exist',
                },
            })
        } else {
            return res.status(200).json({
                message: 'Delete order success',
            })
        }
    } catch (err) {
        next(err)
    }
}

const getOrderByID = async (req, res, next) => {
    try {
        const { orderID } = req.value.params
        const order = await Order.findOne({ id: orderID })
        if (!order) {
            return res.status(404).json({
                message: 'Order not exist',
            })
        } else {
            return res.status(200).json({
                order,
            })
        }
    } catch (err) {
        next(err)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
        return res.status(200).json({
            orders,
        })
    } catch (err) {
        next(err)
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { orderID } = req.value.params
        const newOrder = req.value.body
        const order = await Order.findOneAndUpdate({ id: orderID }, newOrder)
        if (!order) {
            return res.status(404).json({
                message: 'Order not exist',
            })
        } else {
            return res.status(200).json({
                message: 'Update order success',
            })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createOrder,
    deleteOrder,
    getOrderByID,
    getOrders,
    updateOrder,
}
