const { body, validationResult, param } = require('express-validator');

exports.musicDataValidator = [
  body('artist_id')
    .notEmpty()
    .withMessage('Artist ID is required')
    .isInt()
    .withMessage('Artist ID must be a valid integer'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('album_name')
    .trim()
    .notEmpty()
    .withMessage('Album name is required'),

  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
    }
    next();
  }
];

exports.musicUpdateValidator = [
  param('id')
    .isInt()
    .withMessage('Music ID must be a valid integer'),

  body('artist_id')
    .optional()
    .isInt()
    .withMessage('Artist ID must be a valid integer'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('album_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Album name cannot be empty'),

  body('genre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Genre cannot be empty'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({message: errors.array()[0].msg, status: 400, name: 'CustomError'});
    }
    next();
  }
];

