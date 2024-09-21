const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Phuripat')
})

app.listen(port, () => {
    console.log(`Project is running on http://localhost:${port}`)
})

const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb://localhost:27017/';
const connectDB = async() => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('MongoDB is now conneted.')
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();
// -------------------------------------------------------------------------------------------------------------------------------
app.get('/slist', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db("pp_db").collection("Top50").find({}).sort({"Ranking": 1}).limit(70).toArray();
    await client.close();
    res.status(200).send(objects);

})
// -------------------------------------------------------------------------------------------------------------------------------
app.post('/slist/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);

    await client.connect();
    await client.db("pp_db").collection("Top50").insertOne({
        "Ranking": object['Ranking'],
        "Name": object['Name'],
        "Year": object['Year'],
        "Minutes": object['Minutes'],
        "genre": object['genre'],
        "Rating": object['Rating'],
        "Votes": object['Votes'],
    });

    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object
    });
});

// -------------------------------------------------------------------------------------------------------------------------------
app.put('/slist/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db("pp_db").collection("Top50").updateOne({'_id':  ObjectId.createFromHexString(id)}, 
    {"$set": {
        "Ranking": object['Ranking'],
        "Name": object['Name'],
        "Year": object['Year'],
        "Minutes": object['Minutes'],
        "genre": object['genre'],
        "Rating": object['Rating'],
        "Votes": object['Votes'],
    }});
    await client.close();
    res.status(200).send({
        'status': "ok",
        'message': "Object with ID "+id+" is updated.",
        'object': object
    });
})
// -------------------------------------------------------------------------------------------------------------------------------
app.delete('/slist/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db("pp_db").collection("Top50").deleteOne({"_id": ObjectId.createFromHexString(id)});
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID"+ id + " is deleted."
    });
})

// -------------------------------------------------------------------------------------------------------------------------------

app.get('/slist/field/:searchText', async (req, res) => {
    const { params } = req;
    const searchText = params.searchText;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const objects = await client.db("pp_db").collection("Top50").find({$or:[{Ranking: { $regex: searchText, $options: 'i' } },{Name: { $regex: searchText, $options: 'i' } },{Year: { $regex: searchText, $options: 'i' } },{Rating: { $regex: searchText, $options: 'i' } }]}).sort({ "searchText": 1 }).limit(10).toArray();
        searchText
        res.status(200).send({
            "status": "ok",
            "searchText": searchText,
            "Complaint": objects
        });
    } catch (error) {
        console.error('Error while searching:', error);
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        await client.close();
    }
});

app.get('/slist/:id', async (req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const object = await client.db("pp_db").collection("Top50").findOne({ "_id": ObjectId.createFromHexString(id) });
        res.status(200).send({
            "status": "ok",
            "id": id,
            "Complaint": object
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        await client.close();
    }
});
