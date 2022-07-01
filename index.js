const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const result = await taskCollection.insertOne(newTask);
            res.send(result)
        })

        app.get('/task', async (req, res) => {
            const users = await taskCollection.find().toArray();
            res.send(users)
        })
        app.get('/task/:id',async(req,res) =>{
            const id=req.params.id;
            const query = {_id: ObjectId(id)};
            const result= await taskCollection.findOne(query)
            res.send(result)
            
        })

        app.put('/task/:id',async(req,res) =>{
            const id=req.params.id;
            const updateTask = req.body;
            console.log(updateTask)
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateTask.title,
                    details: updateTask.details,
                    time: updateTask.time
                },
              };
              const result = await taskCollection.updateOne(filter, updateDoc, options);
              res.send(result);
        })
    }
    finally {
     
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello task one')
})



app.listen(port, () => {
    console.log(`JOb task port on ${port}`)
})