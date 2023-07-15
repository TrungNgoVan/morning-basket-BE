'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../middlewares/passport');

const CustomerController = require('../controllers/customerController');

const { schemas, validateParam, validateBody } = require('../helpers/routeHelper')

router.route('/')
    .get(
        CustomerController.getCustomers
    )
    .post(
        validateBody(schemas.customerSchema),
        CustomerController.createCustomer
    )

router.route('/signup')
    .post(
        validateBody(schemas.authSignUpSchema),
        CustomerController.signup
    )

router.route('/signin')
    .post(
        validateBody(schemas.authSignInSchema),
        (req, res, next) => {
            const email = req.body.email;
            const phoneNumber = req.body.phoneNumber;
            const strategy = email != null && phoneNumber == null ? 'email' : 'phoneNumber';
            passport.authenticate(strategy, { session: false })(req, res, next);
        },
        CustomerController.signin
    );

router.route('/secret')
    .get(
        passport.authenticate('jwt', { session: false }),
        CustomerController.secret
    )

router.route('/:customerID')
    .get(
        validateParam(schemas.idSchema, 'customerID'),
        CustomerController.getCustomerByID
    )
    .put(
        validateParam(schemas.idSchema, 'customerID'),
        validateBody(schemas.customerSchema),
        CustomerController.replaceCustomer
    )
    .patch(
        validateParam(schemas.idSchema, 'customerID'),
        validateBody(schemas.customerOptionalSchema),
        CustomerController.updateCustomer
    )
    .delete(
        validateParam(schemas.idSchema, 'customerID'),
        CustomerController.deleteCustomer
    )
module.exports = router;
