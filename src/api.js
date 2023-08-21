import express, {Router} from 'express';
import {json, urlencoded} from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import logger from 'morgan';
import mongoose from 'mongoose';
// routes
import authRouter from './routes/auth.route';
import modRouter from './routes/moderator.route';
import customerRouter from './routes/customer.route';
import adminRouter from './routes/admin.route';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const app = express();
// middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(logger('dev'));

router.get('/', (req, res) => {
    console.log('Welcome to the JoyServe API');
    res.send('Welcome to the JoyServe API');
});

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/mod', modRouter);
// app.use('/.netlify/functions/api/booking', bookingRouter);
app.use('/.netlify/functions/api/admin', adminRouter);
app.use('/.netlify/functions/api/customer', customerRouter);
app.use('/.netlify/functions/api', router);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("[MONGO] Successfully connect to MongoDB.");
}).catch(err => {
    console.error("[MONGO] Connection error", err.message);
    process.exit();
});
export default app;
const app_handler = serverless(app);

export const handler = async (event, context) => {
    return await app_handler(event, context);
}
