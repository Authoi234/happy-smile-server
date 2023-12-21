const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// creating app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connecting to the server

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6iupoas.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const services = client.db('happy-smile').collection('services');

    app.get('/', (req, res) => {
        
    })
  } finally {

  }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Happy smile server')
});

app.listen(port, () => {
    console.log('Happy smile server is running on port', port);
})