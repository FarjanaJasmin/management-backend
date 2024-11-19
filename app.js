const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000; 
const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://farjana:lgcUNjkx0z4UBEaz@cluster0.v1pfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    client.connect();

    const database = client.db('management-app');
    const alluser = database.collection('all-user');
    const schedule = database.collection('routine');

    app.get('/alluser', async(req, res)=>{
        const allUserData = await alluser.find().toArray();
        res.send(allUserData);
    });

    app.post('/teacher', async(req, res)=>{
      const teacher = req.body;
      const result = await alluser.insertOne(teacher);
      res.send(result);
    })
    app.get('/teacher', async(req, res)=>{
      const query = {role: req.query.type};
      const result = await alluser.find(query).toArray();
      res.send(result);
    })

    app.post('/routine', async(req, res)=>{
      const routine = req.body;
      const result = await schedule.insertOne(routine);
      res.send(result);
    })

    app.get('/routine', async(req, res)=>{
      const sec = req.query.section;
      const query = {section: sec};
      const allSchedule = await schedule.find(query).toArray();
      res.send(allSchedule);
    })
    
    app.get('/counsiling', async(req, res)=>{
      const {teacher, day} = req.query;
      const query = {teacherName: teacher, day: day};
      const allSchedule = await schedule.find(query).toArray();
      res.send(allSchedule);
    })

  

    
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
    res.send('Hello World!')
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
