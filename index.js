const PORT = process.env.PORT || 4000;
const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");

mongodb.connect(process.env.CONNECTION_STRING, { useUnifiedTopology: true }, function (err, client) {
    module.exports = client;
    const app = require('./app.js');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})