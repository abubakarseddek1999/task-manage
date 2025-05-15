const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// task-management
// iumJzbcBSooQFUul



const uri = "mongodb+srv://task-management:iumJzbcBSooQFUul@cluster0.bidtnbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCollection = client.db("task-management").collection("users");
        const taskCollection = client.db("task-management").collection("tasks");



        app.post('/users', async (req, res) => {
            const user = req.body;
            try {
                const result = await userCollection.insertOne(user);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });
        app.get('/users', async (req, res) => {
            try {
                const result = await userCollection.find({}).toArray();
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });

        // api make for user login by email and password check if user exist and token generate and send to client user email and token as response
        const secretKey = 'your_secret_key'; // Replace with a secure key

        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            try {
            const user = await userCollection.findOne({ email });
            if (user && user.password === password) {
                const token = jwt.sign({ email: user.email, id: user._id }, secretKey, { expiresIn: '1h' });
                res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
            } catch (error) {
            res.status(500).json({ error });
            }
        });
        // get user by id and send to client user data as response
        const { ObjectId } = require('mongodb'); // Add this at the top of the file if not already imported

        app.get('/user/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const user = await userCollection.findOne({ _id: new ObjectId(id) });
                if (user) {
                    res.json(user);
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ error: "Invalid ID format or server error" });
            }
        });

        // make api for add task and send to client task data as response 
        app.post('/tasks', async (req, res) => {
            const { task } = req.body;
            try {
                const result = await taskCollection.insertOne(task);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });

        // make api for get all task and send to client task data as response 
        app.get('/tasks', async (req, res) => {
            try {
                const result = await taskCollection.find({}).toArray();
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });

        // make api for get task by id and send to client task data as response 
        app.get('/task/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await taskCollection.findOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });

        // make api for update task by id and send to client task data as response 
        app.put('/task/:id', async (req, res) => {
            const { id } = req.params;
            const { task } = req.body;
            try {
                const result = await taskCollection.updateOne({ _id: new ObjectId(id) }, { $set: task });
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });

        // make api for delete task by id and send to client task data as response 
        app.delete('/task/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('simple-crud-server');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});