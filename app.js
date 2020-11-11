const express = require('express');
const app = express();
const path = require('path');
const config = require('./config/index');
const transactionController = require('./controllers/transaction');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index.pug');
});

app.get('/rest/searchTransaction', transactionController.searchTransaction);

app.listen(config.port, config.hostname, () => {
    console.log(`the app is listening on port: ${config.port} and hostname: ${config.hostname}`);
});