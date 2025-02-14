const { body, validationResult, param } = require('express-validator');

exports.artistDataValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Artist name is required'),

  body('dob')
    .trim()
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Invalid date format (expected YYYY-MM-DD)'),

  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('first_release_year')
    .notEmpty()
    .withMessage('First release year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('First release year must be a valid year'),

  body('no_of_albums_released')
    .notEmpty()
    .withMessage('Number of albums released is required')
    .isInt({ min: 0 })
    .withMessage('Number of albums must be a valid number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
    }
    next();
  }
];

exports.artistUpdateValidator = [
  param('id')
    .isInt()
    .withMessage('Artist ID must be a valid integer'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Artist name cannot be empty'),

  body('dob')
    .optional()
    .trim()
    .isISO8601()
    .withMessage('Invalid date format (expected YYYY-MM-DD)'),

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

  body('first_release_year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('First release year must be a valid year'),

  body('no_of_albums_released')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of albums must be a valid number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
    }
    next();
  }
];

