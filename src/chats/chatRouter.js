const express = require("express");
const { createGroupChat, addToGroup } = require("./chatController");

const router = express.Router();

router.post("/", createGroupChat);
router.put("/add", addToGroup);

module.exports = router;
