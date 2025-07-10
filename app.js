const express = require("express");
const cors = require("cors");
const connectToDb = require("./DB/db");

const app = express();
const authRoutes=require('./routes/authRoutes');

connectToDb(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/mountainchain/api/',authRoutes);

module.exports = app;
