const express = require('express');
const cors = require('cors')//cors for own server connected with own
const app = express();
const ObjectId = require('mongodb').ObjectId;
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
    const eventsCollection = database.collection("events");

    //getServices
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    })

    //Save user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);

    })

    //Google Sign In update
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    })

    // add events
    app.post("/addEvent", async (req, res) => {
      console.log(req.body);
      const result = await eventsCollection.insertOne(req.body);
      // console.log(result);
      res.json(result);
    });

    //Find single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
  })

  }
  finally {
    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is ok')
});

app.listen(port, () => {
  console.log('Port is Ok');
})