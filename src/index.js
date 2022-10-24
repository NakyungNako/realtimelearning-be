require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("../config/mongoDBConfig");
const userRoutes = require("./users/userRouter");

//database connection
connection();

app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", userRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend server is running...`)
);
