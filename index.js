const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// 6XG1yMCTrTh0g0v1
// petuk_DB

// middleware
app.use(cors())
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


const dbConnect = async() =>{
    try{
        await client.connect()
        console.log('Db connect');

    // Routes 
    app.post('/user', async( req , res ) => {
        const user = req.body
        const result = await userCollection.insertOne(user)
        res.send(result)
    })
    
    app.get('/users' , async( req, res ) =>{
        const allUser = await userCollection.find().toArray()
        res.send(allUser)
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