const express = require("express");
const cors = require("cors");
const connectToDb = require("./DB/db");

const app = express();
const authRoutes=require('./routes/authRoutes');
const destinationrRoutes=require('./routes/destinationRoutes');

connectToDb(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/mountainchain/api/',authRoutes);
app.use('/mountainchain/api/destination/',destinationrRoutes);

module.exports = app;
