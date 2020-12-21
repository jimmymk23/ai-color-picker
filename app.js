const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const API_v1 = require('./routes/v1');
app.use('/api/v1', API_v1);

const build_path = './build';
app.use(express.static(build_path));
app.use('*', express.static(build_path));

module.exports = app;
