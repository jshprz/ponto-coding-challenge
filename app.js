require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const transactionController = require('./controllers/transaction');
const bodyParser = require('body-parser');
const middleware = require('./middleware/requestValidator');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', transactionController.searchTransactionPage);

app.get('/rest/searchTransaction', transactionController.searchTransaction);

app.post('/rest/createTransaction', middleware.createTransaction, transactionController.createTransaction);

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
    console.log(`the app is listening on port: ${process.env.APP_PORT} and hostname: ${process.env.APP_HOSTNAME}`);
});
