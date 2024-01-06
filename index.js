const express = require("express");
const config = require("./config/config");

const cors = require("cors");
const app = express();

app.use(cors());
const mongoose = require("mongoose");

mongoose
  .connect(config.connectionnURl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Set the server selection timeout to 30 seconds
  })
  .then(() => console.log("connected to Database"))
  .catch((err) => console.log("connection failed", err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,OPTIONS,DELETE"
  );
  next();
});
app.use(express.static("public"));
const userRoute = require("./routes/userRoute");
const storeRoutes = require("./routes/storeRoute");
const categoryRoutes = require("./routes/categoryRoute");
const subCategoryRoutes = require("./routes/subCategoryRoute");
const productRoutes = require("./routes/productRoute");
const commonRoutes = require("./routes/commonRoute");
const cartRoutes = require("./routes/cartRoute");
const addressRoutes = require("./routes/addressRoute");

app.use("/api", userRoute);
app.use("/api", storeRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subCategoryRoutes);
app.use("/api", productRoutes);
app.use("/api", commonRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);

app.listen(3000, () => {
  console.log("Server is runing....");
});
