const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9d7z5qs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        const touristsDB = client.db("touristsDB");
        const touristsSpotCollection = touristsDB.collection("touristSpots");

        app.post("/add-tourists-spot", async (req, res) => {
            const newTouristsSpot = req.body
            const result = await touristsSpotCollection.insertOne(newTouristsSpot);
            res.send(result)
        })
        app.get("/all-tourists-spot", async (req, res) => {
            const result = touristsSpotCollection.find();
            const allTouristsSpotData = await result.toArray();
            res.send(allTouristsSpotData)
        })
        app.get("/tourists-spot/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const touristsSpot = await touristsSpotCollection.findOne(query);
            res.send(touristsSpot)
        })
        app.get("/individual-tourists-spot/:email", async (req, res) => {
            const email = req.params.email;
            const query = { user_email: email };
            const result = touristsSpotCollection.find(query);
            const individualTouristsSpot = await result.toArray()
            res.send(individualTouristsSpot)
        })
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const newData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateData = {
                $set: {
                    image_url: newData.image_url,
                    country_Name: newData.country_Name,
                    average_cost: newData.average_cost,
                    location: newData.location,
                    seasonality: newData.seasonality,
                    short_description: newData.short_description,
                    total_visitors_per_year: newData.total_visitors_per_year,
                    tourists_spot_name: newData.tourists_spot_name,
                    travel_time: newData.travel_time,
                },
            };
            const result = await touristsSpotCollection.updateOne(filter, updateData);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Tourism management server is running")
});
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})