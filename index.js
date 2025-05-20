const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors({
    origin:[ 
      'http://localhost:5173',
      "https://petuk-palace.web.app"
    ],
    optionsSuccessStatus: 200
  }))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.osztyuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// collections
const userCollection = client.db('petuk-palace').collection('users')
const cartCollection = client.db('petuk-palace').collection('cartItem');
const orderCollection = client.db('petuk-palace').collection('orders')
const menuCollection = client.db('petuk-palace').collection('menu')


const dbConnect = async() =>{
    try{
        // await client.connect()
        // console.log('Db connect');

    // Routes 
    app.post('/user', async( req , res ) => {
        const user = req.body
        const query = { email : user.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
            return res.send({message :'User already exists'})
        }
        const result = await userCollection.insertOne(user)
        res.send(result)
    })
    
    app.get('/users' , async( req, res ) =>{
        const allUser = await userCollection.find().toArray()
        res.send(allUser)
    })
    
    app.get('/users/:email', async( req, res ) => {
        const query = { email: req.params.email}
        const user = await userCollection.findOne(query)
        res.send(user)
    })


    // cart 
    app.post('/cart' , async( req , res ) =>{
        const item = req.body
        const result = await cartCollection.insertOne(item)
        res.send(result)
    })

    app.get('/cart/:email' , async( req , res) =>{
        const email =  req.params.email
        const query = {userEmail : email}
        const items = await cartCollection.find(query).toArray()
        res.send(items)
    })

    // remove items 
    app.delete('/deleteItem/:id' , async( req, res) =>{
        const id = req.params.id
        const query = { _id : new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
    })

    app.delete('/deleteItems/:email' , async( req, res) =>{
        const email = req.params.email
        const query = { userEmail: email}
        const result = await cartCollection.deleteMany(query)
        res.send(result)
    })

    // orders
    app.post('/orders' , async( req , res ) =>{
        const order = req.body
        const result = await orderCollection.insertOne(order)
        res.send(result)
    })

    app.get('/allOrder' , async( req , res ) =>{
        const orders = await orderCollection.find().toArray()
        res.send(orders)
    })

    app.get('/orders/:email', async(req ,res) =>{
        const email = req.params.email
        const query = { userEmail: email}
        const result = await orderCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/delete/:id' , async( req, res) =>{
        const id = req.params.id
        const query = { _id : new ObjectId(id)}
        const result = await orderCollection.deleteOne(query)
        res.send(result)
    })
   
    // add menu
    app.post('/add-menu', async (req, res) => {
    const newItem = req.body;
    const result = await menuCollection.insertOne(newItem);
    res.send(result);
    });

    app.get('/menu', async( req, res )=> {
        const menu = await menuCollection.find().toArray()
        res.send(menu)
    })




    }
    catch(err){
         console.log(err.name , err.massage);

    }
}

dbConnect()

app.get('/', async (req ,res)=>{
    res.send('server is Running')
})

app.listen(port, ()=>{
    console.log(`Server is running on the: ${port} `);
})