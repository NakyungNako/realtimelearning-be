require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connection = require("../config/mongoDBConfig");
const userRoutes = require("./users/userRouter");
const credentials = require("../middleware/credentials");

//database connection
connection();

app.use(credentials);
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());

//routes
app.use("/api/users", userRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend server is running...`)
);
