import express, { Router } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

// routes
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

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api', router);

export default app;
export const handler = serverless(app);
