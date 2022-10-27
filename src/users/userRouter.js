const express = require("express");
const router = express.Router();
const { register, login } = require("./userController");

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);

module.exports = router;
