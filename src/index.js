require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const connection = require("../config/mongoDBConfig");
const userRoutes = require("./users/userRouter");
const groupRoutes = require("./groups/groupRouter");
const presentationRoutes = require("./presentations/presentationRouter");
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
app.use("/api/present", presentationRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend server is running...`)
);

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("join_room", (data) => {
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.broadcast.to(data.room).emit("receive_message", data);
//   });

//   socket.on("send_data", (data) => {
//     socket.broadcast.to(data.room).emit("receive_data", data);
//   });
// });

// server.listen(process.env.SOCKET_PORT || 5001, () => {
//   console.log("Socket server is running");
// });
