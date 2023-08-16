const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../configs/index')

const encodeAToken = (customerID) => {
    return jwt.sign(
        {
            iss: 'Morning-Basket',
            sub: customerID,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        },
        JWT_SECRET
    )
}

const decodeAToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return decoded
    } catch (err) {
        throw new Error('Invalid token')
    }
}

const authenticateToken = (req, res, next) => {
    // const token = req.headers.authorization
    const token = req.cookies[AUTH_TOKEN_STORAGE_KEY]
    if (!token) {
        return res
            .status(401)
            .json({ message: 'Authentication token is required' })
    }
    try {
        const decoded = decodeAToken(token)
        req.user = decoded
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Invalid authentication token' })
    }
}

module.exports = {
    authenticateToken,
    encodeAToken,
    decodeAToken,
}
