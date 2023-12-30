const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// creating app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connecting to the server

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

    const servicesCollection = client.db('happy-smile').collection('services');
    const reviewsCollection = client.db('happy-smile').collection('reviews');

    app.get('/services', async (req, res) => {
      const limit = parseInt(req.query.limit);
      const query = {};
      const cursor = servicesCollection.find(query)?.sort({ createdAt: -1 });
      const services = await cursor.limit(limit).toArray();
      res.send(services);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const services = await servicesCollection.findOne(query);
      res.send(services);
    });

    app.get('/reviews/:serviceId', async (req, res) => {
      const serviceid = req.params.serviceId;
      const query = { serviceId: { $eq: `${serviceid}` } };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.post('/reviews', async (req, res) => {
      const newReview = req.body;

      const result = await reviewsCollection.insertOne(newReview);

      res.send(result);
    });

    app.get('/myreviews/:email', async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: { $eq: userEmail } };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.delete('/myreviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/myreviews/:id', async (req, res) => {
      const id = req.params.id;
      const review = req.body.review;
      const filter = { _id: new ObjectId(id) };
      const updatedReview = {
        $set: {
          review: review
        }
      }
      const result = await reviewsCollection.updateOne(filter, updatedReview);
      res.send(result);
    });
    app.post('/addServices', async(req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
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
