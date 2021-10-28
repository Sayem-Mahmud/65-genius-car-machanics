//connected with 65-1-genius-car-mechanics-module-61
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc7c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

//database connection
async function run() {
    try {
        await client.connect()
        // console.log('connected to datatbase');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');


        //GET API (All data)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Runnng genius Server on Port', port)
})