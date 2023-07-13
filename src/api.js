import express from "express";
import { createClient } from '@supabase/supabase-js'
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
dotenv.config()


const app = express();

const router = express.Router();

app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {auth: {persistSession: false}});

router.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()
    res.send(data);
    if (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/products/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id)
    if (error) {
        res.status(400).json({ error: error.message })
    }
    res.send(data);
});

router.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
        .eq('id', req.params.id)
    if (error) {
        res.status(400).json({ error: error.message })
    }
    res.send("Product updated");
});

router.delete('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.status(400).json({ error: error.message })
    }
    res.send("Product deleted");
});

router.post('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
    if (error) {
        res.status(400).json({ error: error.message })
    }
    res.send("Product created");
});

router.get('/', async (req, res) => {
    res.send("Hello World");
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });

app.use(`/.netlify/functions/api`, router);

module.exports.handler = serverless(app);
module.exports = app;
