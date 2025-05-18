const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())




app.get('/', async (req ,res)=>{
    res.send('server is Running')
})

app.listen(port, ()=>{
    console.log(`Server is running on the: ${port} `);
})