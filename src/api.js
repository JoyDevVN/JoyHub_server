import express, { Router } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

// const productsRouter = require('./routes/products.route');
// import accRouter from './routes/account.route';
// import roleRouter from './routes/role.route';
import authRouter from './routes/auth.route';
const router = Router();

const app = express();
// middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

router.get('/', (req, res) => {
    console.log('Welcome to the JoyServe API');
    res.send('Welcome to the JoyServe API');
});

// app.use('/.netlify/functions/api/products', productsRouter);
// app.use('/.netlify/functions/api/accounts', accRouter);
// app.use('/.netlify/functions/api/roles', roleRouter);
app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api', router);

// error handler middleware
// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     console.error(err.message, err.stack);
//     res.status(statusCode).json({ message: err.message });
//     return;
// });
export default app;
export const handler = serverless(app);
