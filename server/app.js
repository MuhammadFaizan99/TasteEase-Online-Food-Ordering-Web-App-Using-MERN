require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5173;
const path = require("path");
const { userRouter } = require("./route/userRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const { dbConnect } = require("./connection");
const { orderRouter } = require("./route/orderRoute");
const { menuRouter } = require("./route/menuRoute");
const { teamRouter } = require("./route/chefRoute");
const { CustSupportRouter } = require("./route/CustSupportRoute");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin : [""],
  methods : ["POST","GET","PUT","PATCH","DELETE"],
  credentials : true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connection
dbConnect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((e) => {
    console.log("No DB Connection " + e);
  });

// Routes
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/menu", menuRouter);
app.use("/team", teamRouter);
app.use("/customers", CustSupportRouter);

// Server connection
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
