const express = require("express");
const { sendMessage, allMessages } = require("./messageController");

const router = express.Router();

router.post("/", sendMessage);
router.post("/getMessages", allMessages);

module.exports = router;
