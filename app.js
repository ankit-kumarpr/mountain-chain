const express = require("express");
const cors = require("cors");
const connectToDb = require("./DB/db");

const app = express();
const authRoutes=require('./routes/authRoutes');
const destinationrRoutes=require('./routes/destinationRoutes');
const hotelRoutes = require('./routes/hotelroutes');
const cityRoutes = require('./routes/cityRoutes');
const transportServiceRoutes = require('./routes/transportServiceRoutes');
connectToDb(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/mountainchain/api/',authRoutes);
app.use('/mountainchain/api/destination/',destinationrRoutes);
app.use('/mountainchain/api/hotel/',hotelRoutes);
app.use('/mountainchain/api/city/',cityRoutes);
app.use('/mountainchain/api/transport/',transportServiceRoutes);
module.exports = app;
