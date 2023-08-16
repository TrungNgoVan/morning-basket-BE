const Cart = require('../models/cartModel')
const Customer = require('../models/customerModel')
const { AUTH_TOKEN_STORAGE_KEY } = require("../configs")
const { decodeAToken } = require('../middlewares/authenticateToken')

const createCart = async (req, res, next) => {
    try {
        const cart = req.value.body
        const newCart = new Cart(cart)
        await newCart.save()
        return res.status(200).json({
            message: 'CART_CREATE:SUCCESS',
            cart: newCart,
        })
    } catch (err) {
        next(err)
    }
}

const deleteCart = async (req, res, next) => {
    try {
        const { cartID } = req.value.params
        const cart = await Cart.findOneAndDelete({ id: cartID })
        if (!cart) {
            return res.status(404).json({
                message: 'CART_DELETE:NOT_FOUND',
            })
        } else {
            return res.status(200).json({
                message: 'CART_DELETE:SUCCESS',
            })
        }
    } catch (err) {
        next(err)
    }
}

const getCartByCustomerID = async (req, res, next) => {
    try {
        // const token = req.headers.authorization
        const token = req.cookies[AUTH_TOKEN_STORAGE_KEY]
        const decoded = decodeAToken(token)
        const customer = await Customer.findById(decoded.sub)
        const carts = await Cart.find({ customerId: customer.id })
        return res.status(200).json({
            carts,
        })
    } catch (err) {
        next(err)
    }
}

const getCartByID = async (req, res, next) => {
    try {
        const { cartID } = req.value.params
        const cart = await Cart.findOne({ id: cartID })
        if (!cart) {
            return res.status(404).json({
                message: 'CART_GET:NOT_FOUND',
            })
        } else {
            return res.status(200).json({
                cart,
            })
        }
    } catch (err) {
        next(err)
    }
}

const getCarts = async (req, res, next) => {
    try {
        const carts = await Cart.find({})
        return res.status(200).json({
            carts,
        })
    } catch (err) {
        next(err)
    }
}

const updateCart = async (req, res, next) => {
    try {
        const { cartID } = req.value.params
        const newCart = req.value.body
        const cart = await Cart.findOneAndUpdate({ id: cartID }, newCart)
        if (!cart) {
            return res.status(404).json({
                message: 'CART_UPDATE:NOT_FOUND',
            })
        } else {
            return res.status(200).json({
                message: 'CART_UPDATE:SUCCESS',
            })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createCart,
    deleteCart,
    getCartByCustomerID,
    getCartByID,
    getCarts,
    updateCart,
}
