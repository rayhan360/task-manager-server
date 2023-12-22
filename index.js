const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6box3t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db("tasks").collection("task");

    // get task data
    app.get("/task/user", async (req, res) => {
      const email = req.query.email;
      const query = { user: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.findOne(query);
      res.send(result)
    })
    // post task data
    app.post("/task", async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    });

    app.patch("/task/:id", async (req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};

      const changedStatusOnGoing = {
        $set: {
          status: "ongoing"
        },
      };

      const result = await taskCollection.updateOne(
        filter,
        changedStatusOnGoing
      );
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
