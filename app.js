require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const path = require("path");
const router = require("./routes");

mongoose.connect(config.db.main, config.db.options);
mongoose.connection.on('error', console.log);

const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
// console.log('jwt', require('crypto').randomBytes(64).toString('hex'));
const server = app.listen(config.port, () => {
	console.log(`Server listening at port : `, config.port);
});
