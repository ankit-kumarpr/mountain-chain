const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDb = require("./DB/db");

const app = express();
const upload = require("./middleware/upload")
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const hotelRoutes = require("./routes/hotelroutes");
const cityRoutes = require("./routes/cityRoutes");
const transportServiceRoutes = require("./routes/transportServiceRoutes");
const uploadRoute = require("./routes/uploadRoute");
const suppliersRoute = require("./routes/supplierRoute");
const IncluExcluRoutes = require("./routes/IncluExcluRoutes");
const termsAndConditionsRoutes = require('./routes/termsAndConditionsRoutes');
const paymentPreferenceRoutes = require("./routes/paymentPreferenceRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/mountainchain/api/", authRoutes);
app.use("/mountainchain/api/destination/", destinationRoutes);
app.use("/mountainchain/api/hotel/", hotelRoutes);
app.use("/mountainchain/api/city/", cityRoutes);
app.use("/mountainchain/api/transport/", transportServiceRoutes);
app.use("/mountainchain/api/payment-preferences", paymentPreferenceRoutes);
app.use("/mountainchain/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/mountainchain/api/upload", uploadRoute);
app.use("/mountainchain/api/suppliers", suppliersRoute);
app.use('/mountainchain/api/enex', IncluExcluRoutes);
app.use('/mountainchain/api/terms-and-conditions', termsAndConditionsRoutes);

// --- THIS IS THE CORRECTED LINE ---
app.use('/mountainchain/api/quotations', quotationRoutes);

module.exports = app;