const postgres = require('../config/database');
const { check, validationResult } = require('express-validator');

module.exports.searchTransactionPage = (req, res) => {
    res.render('index.pug');
}

module.exports.searchTransaction = (req, res) => {
    const searchInput = req.query.searchInput.toLowerCase();

    postgres.query('SELECT * FROM transaction_tbl WHERE lower(name) LIKE $1 OR message LIKE $1 OR CAST(amount AS varchar(20)) LIKE $1', 
        [searchInput], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).type('application/json').send(result.rows);
    });
}

module.exports.createTransaction = (req, res) => {
    const name = req.body.name.trim();
    const message = req.body.message.trim();
    const amount = req.body.amount.trim();
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(200).type('application/json').end(JSON.stringify({ errors: errors.array() }));
    }

    postgres.query('INSERT INTO transaction_tbl(name, message, amount) VALUES ($1, $2, $3)', [name, message, amount], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send('Transaction created successfully');
    });
}