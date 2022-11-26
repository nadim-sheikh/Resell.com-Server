const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json())

//Data Base -----------------------------------------------


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jcatyox.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//---------------------------------------------------------------------------
async function run() {
    try{
        const ProductCl = client.db("resell-com").collection("products");
        const categoryCl = client.db("resell-com").collection("category");
        const cartCl = client.db("resell-com").collection("cart");


        app.get('/products',async(req, res) =>{
            const cursor = ProductCl.find({});
            const mobile = await cursor.toArray();
            res.send(mobile);
        })
        app.get('/category',async(req, res) =>{
            const cursor = categoryCl.find({});
            const category = await cursor.toArray();
            res.send(category);
        })
        app.get('/products/:id', async(req, res)=>{
            const {id} = req.params;
            const query = {_id: ObjectId(id)};
            const mobile = await ProductCl.findOne(query);
            res.send(mobile);
        })
        app.get('/cart', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = cartCl.find(query);
            const cart = await cursor.toArray();
            res.send(cart);
        })

        app.post('/cart', async(req,res)=>{
            const addCart = req.body;
            const result = await cartCl.insertOne(addCart);
            res.send(result);
        })
        app.delete('/cart/:id',async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await cartCl.deleteOne(query);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))

app.get('/', async (req, res) => {
    res.send('This Server is running')
})

app.listen(port)