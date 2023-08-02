'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../middlewares/passport')

const CustomerController = require('../controllers/customerController')

const {
    schemas,
    validateParam,
    validateBody,
    validateSignInBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(CustomerController.getCustomers)
    .post(
        validateBody(schemas.customerSchema),
        CustomerController.createCustomer
    )

router
    .route('/info')
    .get(CustomerController.getInfoCustomer)

router
    .route('/infoPaying')
    .get(CustomerController.getCustomerInfoPaying)
    .post(CustomerController.addInfoPaying)

router
    .route('/signup')
    .post(validateBody(schemas.authSignUpSchema), CustomerController.signup)

router.route('/signin').post(
    validateBody(schemas.authSignInSchema),
    validateSignInBody,
    (req, res, next) => {
        const email = req.value.body.email
        const phoneNumber = req.value.body.phoneNumber
        const strategy =
            email != undefined && phoneNumber == undefined
                ? 'email'
                : 'phoneNumber'
        passport.authenticate(strategy, { session: false })(req, res, next)
    },
    CustomerController.signin
)

router
    .route('/orders')
    .get(
        CustomerController.getCustomerOrders
    )

router
    .route('/secret')
    .get(
        passport.authenticate('jwt', { session: false }),
        CustomerController.secret
    )

router
    .route('/:customerID')
    .get(
        validateParam(schemas.idNumberSchema, 'customerID'),
        CustomerController.getCustomerByID
    )
    .put(
        validateParam(schemas.idNumberSchema, 'customerID'),
        validateBody(schemas.customerSchema),
        CustomerController.replaceCustomer
    )
    .patch(
        validateParam(schemas.idNumberSchema, 'customerID'),
        validateBody(schemas.customerOptionalSchema),
        CustomerController.updateCustomer
    )
    .delete(
        validateParam(schemas.idNumberSchema, 'customerID'),
        CustomerController.deleteCustomer
    )
module.exports = router
