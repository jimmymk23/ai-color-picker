const router = require('express').Router();
const brain = require('brain.js');
const client = require('../index.js');
const dotenv = require('dotenv');
const mongodb = require("mongodb");
dotenv.config();

const db = client.db();
// const colorsDB = db.collection('colors');
const colorsDB = process.env.NODE_ENV === 'production' ? db.collection('colors') : db.collection('dev_colors');

const config = {
    binaryThresh: 0.5, // ¯\_(ツ)_/¯
    hiddenLayers: [3, 3, 3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid'
};

const net = new brain.NeuralNetwork(config);

const database_results = async () => {

    try {
        // Get the Color Data from DB
        const results = await colorsDB.find().toArray();
        // console.log(results)

        // If there are documents in the DB
        net.train(results);
    } catch {
        // if there are no documents in the DB...
        // ... add basic data and research DB
        let data = [
            {
                input: { r: 0, g: 0, b: 0 },
                output: [1]
            },
            {
                input: { r: 1, g: 1, b: 1 },
                output: [0]
            }
        ];
        // Insert Basic Data in database
        colorsDB.insertMany(data);

        // Train net with basic data
        net.train(data);
    }
};
database_results();


router.post('/initialize', async (req, res) => {
    const output = net.run(req.body)[0];
    const textColor = output > .5 ? '#FFF' : '#000';

    const docs = await colorsDB.find().toArray();
    res.json({
        dataDocs: docs,
        text_color: textColor,
        output: output
    });
});

router.post('/process', async (req, res) => {
    let newData = {
        input: req.body.BgColor,
        output: [req.body.chosenTextColor]
    }

    // Save previous color data
    const entry = await colorsDB.insertOne(newData);
    // train new data into net
    const docs = await colorsDB.find().toArray();
    net.train(docs);

    // Pick new BG Color
    let newBgColor = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    };

    // Run net with new BG Color to get new proposed text color
    let output = net.run(newBgColor)[0];

    // Convert run output to 1 or 0
    let proposedTextColor = output > .5 ? 1 : 0;

    // send back to client
    res.json({
        insertedId: entry.insertedId,
        BgColor: newBgColor,
        proposedTextColor: proposedTextColor,
        output: output
    });
});

router.post('/save-edited-color', async (req, res) => {
    const filter = { _id: mongodb.ObjectId(req.body.id) };
    // update the value of the 'output' field to the new color
    const updateDocument = {
        $set: {
            output: [req.body.colorCode]
        }
    };
    const result = await colorsDB.updateOne(filter, updateDocument);
    res.sendStatus(204);
});

router.post('/delete', async (req, res) => {
    colorsDB.deleteOne({ _id: mongodb.ObjectId(req.body.id) });
    res.sendStatus(200);
});

router.get('/reset-data', async (req, res) => {

    await colorsDB.deleteMany();

    const base_data = [
        {
            input: { r: 0, g: 0, b: 0 },
            output: [1]
        },
        {
            input: { r: 1, g: 1, b: 1 },
            output: [0]
        }
    ];

    const added_docs = await colorsDB.insertMany(base_data);

    net.train(added_docs.ops);
    res.json(added_docs.ops);
});

router.get('/retreive-data', async (req, res) => {

    const docs = await colorsDB.find().toArray();
    res.json(docs);

});

router.post('/add-data', async (req, res) => {
    const amount_to_add = req.body.amount_to_add;

    const new_data = [];

    for (let i = 0; i < amount_to_add; i++) {
        //Pick new color
        let newBgColor = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
        };
        // Run through network and Convert output to 1 or 0
        let output = net.run(newBgColor)[0] > .5 ? 1 : 0;
        // Push object to new_data array
        new_data.push({
            input: newBgColor,
            output: [output]
        });
    }
    // Save new_data array to DB
    const added_docs = await colorsDB.insertMany(new_data);
    res.json(added_docs.ops);
})

module.exports = router