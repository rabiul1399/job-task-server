const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekfpp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("googleTask").collection("tasks");

        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log('adding new data', newTask)
            const result = await taskCollection.insertOne(newTask);
            res.send(result)
        })

        app.get('/task', async (req, res) => {
            const users = await taskCollection.find().toArray();
            res.send(users)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello task one')
})



app.listen(port, () => {
    console.log(`JOb task port on ${port}`)
})