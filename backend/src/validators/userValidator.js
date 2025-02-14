const { body, validationResult, param } = require('express-validator');

exports.loginValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .notEmpty()
        .withMessage('Email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
        }
        next();
    }
];

exports.userDataValidation = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),

    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),

    body('password')
        .if(body('id').not().exists()) // Only validate password if `id` is not present (new user)
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .notEmpty()
        .withMessage('Email is required'),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),

    body('gender')
        .trim()
        .notEmpty()
        .withMessage('Gender is required'),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),

    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
        }
        next();
    }
];

exports.userUpdateValidor = [
    param('id')
        .isInt()
        .withMessage('User ID must be a valid integer'),

    body('first_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty'),

    body('last_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty'),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),

    body('phone')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Phone number cannot be empty'),

    body('gender')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Gender cannot be empty'),

    body('address')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Address cannot be empty'),

    body('role')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Role cannot be empty'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
        }
        next();
    }
];