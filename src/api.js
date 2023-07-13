const express = require('express');
const { createClient } = require('@supabase/supabase-js')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config;
const serverless = require('serverless-http');

const productsRouter = require('./routes/products.route');
const router = express.Router();

const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

router.get('/', (req, res) => {
    res.send('Welcome to the JoyServe API');
});

app.use('/.netlify/functions/api/products', productsRouter);
app.use('/.netlify/functions/api', router);

// error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

module.exports.handler = serverless(app);
