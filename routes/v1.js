const router = require('express').Router();
const brain = require('brain.js');
const client = require('../index.js');
const dotenv = require('dotenv');
dotenv.config();

const db = client.db();
const colorsDB = db.collection('colors')

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
        text_color : textColor
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
        proposedTextColor: proposedTextColor
    });
});

router.get('/reset-data', async (req, res) => {

    colorsDB.deleteMany();

    const data = [
        {
            input: { r: 0, g: 0, b: 0 },
            output: [1]
        },
        {
            input: { r: 1, g: 1, b: 1 },
            output: [0]
        }
    ];

    colorsDB.insertMany(data);

    const docs = await colorsDB.find().toArray();
    net.train(docs);

    res.sendStatus(200);
})

router.get('/retreive-data', async (req, res) => {

    const docs = await colorsDB.find().toArray();
    res.json(docs);

})

module.exports = router