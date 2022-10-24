const express = require("express");
const router = express.Router();
const { register } = require("./userController");

/* GET users listing. */
router.post("/register", register);
router.post("/login");

module.exports = router;
