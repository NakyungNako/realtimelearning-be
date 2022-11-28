require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connection = require("../config/mongoDBConfig");
const userRoutes = require("./users/userRouter");
const groupRoutes = require("./groups/groupRouter");
const credentials = require("../middleware/credentials");
const { CLIENT_URL } = require("../config/env");

//database connection
connection();

app.use(credentials);
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(cookieParser());

//routes
app.use("/api/users", userRoutes);
app.use("/api/group", groupRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend server is running...`)
);
