const express = require('express');
const cors = require('cors')//cors for own server connected with own
const app = express();
require("dotenv").config();//dotenv config
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3aidp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("Road-eagles");
      const usersCollection = database.collection("user");
      const servicesCollection = database.collection("services");
      
      //getServices
      app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        // console.log(services);
        res.send(services);
    })
      
    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('Server is ok')
});

app.listen(port, () =>{
    console.log('Port is Ok');
})