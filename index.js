const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster2.cv4uqat.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        
        const userCountry = client.db("usersProfileCreate").collection("country");
        const userStateName = client.db("usersProfileCreate").collection("stateName");
        const userCityName = client.db("usersProfileCreate").collection("cityName");
        const addUsers = client.db("usersProfileCreate").collection("addUsers");

        // country
        app.get('/country', async (req, res) => {
            const query = {};
            const country = await userCountry.find(query).toArray();
            res.send(country);
        })
        app.get('/state', async (req, res) => {
            const query = {};
            const state = await userStateName.find(query).toArray();
            res.send(state);
        })
        app.get('/city', async (req, res) => {
            const query = {};
            const city = await userCityName.find(query).toArray();
            res.send(city);
        })
        // Users add
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await addUsers.insertOne(users);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const user = await addUsers.find(query).toArray();
            res.send(user);
        })
        // user Delete
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await addUsers.deleteOne(filter)
            res.send(result);
        })
        // Edit User
        app.get('/editUser/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id)}
            const editUser = await addUsers.findOne(filter);
            res.send(editUser);
        })

        app.patch('/update/:id',  async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    date: user.date,
                    country: user.country,
                    state: user.state,
                    city: user.city,
                    gender: user.gender,
                    hobby: user.hobby,
                }
            }
            const result = await addUsers.updateOne(query, updateDoc, option);
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('Server is running')
})