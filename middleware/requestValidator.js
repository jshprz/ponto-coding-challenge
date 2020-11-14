const { check, validationResult } = require('express-validator');

module.exports.createTransaction = [
    check('name').not().isEmpty().withMessage('"name" field is required.').custom((value, {req}) => {
        if (value.match(/^[a-zA-Z ]*$/gm)) {
          return Promise.resolve();
        }
        return Promise.reject('numbers and special characters are not allowed on the "name" field.');
    }),
    check('message').not().isEmpty().withMessage('"message" field is required.'),
    check('amount').not().isEmpty().withMessage('"amount" field is required.').isInt().withMessage('"amount" field should be numbers.')
];