const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: dbuser2
// pass: WRawJM3ggpqdLlkP

const uri = "mongodb+srv://dbuser2:WRawJM3ggpqdLlkP@cluster0.i9w8jvi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async await
async function run() {
    try {
        const userCollection = client.db("nodeMongoCrud").collection("users");

        // Read (ALL)
        app.get('/users', async (req, res) => {
            const query = {};   // all
            const cursor = userCollection.find(query);  //to find Multiple
            const users = await cursor.toArray();
            res.send(users);
        });
        
        // Read (One)
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // Create
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const user = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            console.log(result);
            res.send(result);
        });

        // Delete
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete', id);
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });
        
    }
    finally {

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Node Mongo CRUD server running');
})

app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
})