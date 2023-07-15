'use strict'
const Customer = require('../models/customerModel');
const { encodeAToken } = require('../middlewares/authenticateToken');

const createCustomer = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password } = req.value.body;
        const foundCustomer = await Customer.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (!foundCustomer) {
            // Create a new user
            const newCustomer = new Customer({
                name,
                email,
                phoneNumber,
                password
            });
            await newCustomer.save();
            // Encode a token
            const token = encodeAToken(newCustomer._id)
            res.setHeader('Authorization', token);
            return res.status(201).json({
                message: 'Create customer success'
            })
        } else {
            return res.status(403).json({
                error: {
                    message: "Email already exist"
                }
            })
        }
    } catch (err) {
        next(err);
    }
}

const deleteCustomer = async (req, res, next) => {
    try {
        const { customerID } = req.value.params;
        const customer = await Customer.findByIdAndDelete(customerID);
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'Customer not exist'
                }
            })
        } else {
            return res.status(200).json({
                message: 'Delete customer success'
            })
        }
    } catch (err) {
        next(err);
    }
}

const getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find({});
        return res.status(200).json({
            customers
        })
    } catch (err) {
        next(err);
    }
}

const getCustomerByID = async (req, res, next) => { // enforce new user to old user
    try {
        const { customerID } = req.value.params;
        const customer = await Customer.findById(customerID);
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'Customer not exist'
                }
            })
        } else {
            return res.status(200).json({
                customer
            })
        }
    } catch (err) {
        next(err);
    }
}

const replaceCustomer = async (req, res, next) => {
    try {
        const { customerID } = req.value.params;
        const customer = await Customer.findById(customerID);
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'Customer not exist'
                }
            })
        } else {
            const newCustomer = req.value.body;
            await Customer.findByIdAndUpdate(customerID, newCustomer);
            return res.status(200).json({
                message: 'Replace customer success'
            })
        }
    } catch (err) {
        next(err);
    }
}

const updateCustomer = async (req, res, next) => { // number of fields
    try {
        const { customerID } = req.value.params;
        const customer = await Customer.findById(customerID);
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'Customer not exist'
                }
            })
        } else {
            const newCustomer = req.value.body;
            await Customer.findByIdAndUpdate(customerID, newCustomer);
            return res.status(200).json({
                message: 'Update customer success'
            })
        }
    } catch (err) {
        next(err);
    }
}

const secret = async (req, res, next) => {
    return res.status(200).json({
        resource: true
    })
}

// const signin = async (req, res, next) => {
//     passport.authenticate('local', (err, customer, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!customer) {
//             return res.status(401).json({
//                 message: 'Authentication failed'
//             });
//         }
//         req.login(customer, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             return res.status(200).json({
//                 message: 'Authentication successful',
//                 customer: customer
//             });
//         });
//     })(req, res, next);
// };
const signin = async (req, res, next) => {
    const token = encodeAToken(req.user._id);
    res.setHeader('Authorization', token);
    return res.status(200).json({
        message: "Sign in success"
    })
};

const signup = async (req, res, next) => {
    const { name, email, phoneNumber, password } = req.value.body;
    // Check if there is a customer with same email or same phoneNumber
    const foundCustomer = await Customer.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (!foundCustomer) {
        // Create a new user
        const newCustomer = new Customer({
            name,
            email,
            phoneNumber,
            password
        });
        await newCustomer.save();
        // Encode a token
        const token = encodeAToken(newCustomer._id)
        res.setHeader('Authorization', token);
        return res.status(201).json({
            message: 'Sign up successfully'
        })
    } else if (foundCustomer.email === email) {
        return res.status(403).json({
            error: {
                message: "Email already exists"
            }
        })
    } else if (foundCustomer.phoneNumber === phoneNumber) {
        return res.status(403).json({
            error: {
                message: "Phone number already exists"
            }
        });
    }
}

module.exports = {
    createCustomer,
    deleteCustomer,
    getCustomerByID,
    getCustomers,
    replaceCustomer,
    secret,
    signin,
    signup,
    updateCustomer
}

