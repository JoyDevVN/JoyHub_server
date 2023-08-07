import express, { Router } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

// routes
import authRouter from './routes/auth.route';
import modRouter from './routes/moderator.route';
import adminRouter from './routes/admin.route';
import bookingRouter from './routes/booking.route';
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

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/mod', modRouter);
app.use('/.netlify/functions/api/booking', bookingRouter);
app.use('/.netlify/functions/api/admin', adminRouter);
app.use('/.netlify/functions/api', router);

export default app;
export const handler = serverless(app);
