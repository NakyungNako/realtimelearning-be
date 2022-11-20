const express = require("express");
const passport = require("passport");
const passportConfig = require("../../middleware/passport");
const router = express.Router();
const { register, login, usernames, refresh } = require("./userController");

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);
router.get(
  "/usernames",
  passport.authenticate("jwt", { session: false }),
  usernames
);
router.get("/refresh", refresh);

module.exports = router;
