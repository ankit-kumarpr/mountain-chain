const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ Required to use path.join

const connectToDb = require("./DB/db");

const app = express();
const authRoutes = require('./routes/authRoutes');
const destinationrRoutes = require('./routes/destinationRoutes');
const hotelRoutes = require('./routes/hotelroutes');
const cityRoutes = require('./routes/cityRoutes');
const transportServiceRoutes = require('./routes/transportServiceRoutes');
const uploadRoute = require("./routes/uploadRoute");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/mountainchain/api/', authRoutes);
app.use('/mountainchain/api/destination/', destinationrRoutes);
app.use('/mountainchain/api/hotel/', hotelRoutes);
app.use('/mountainchain/api/city/', cityRoutes);
app.use('/mountainchain/api/transport/', transportServiceRoutes);

// Static & File Upload Route
app.use('/mountainchain/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/mountainchain/api/upload", uploadRoute); // Handles CSV uploads

module.exports = app;
