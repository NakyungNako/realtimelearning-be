const express = require("express");
const passport = require("passport");
const passportConfig = require("../../middleware/passport");
const router = express.Router();
const {
  register,
  login,
  usernames,
  refresh,
  logout,
  verifyEmailToken,
  resendEmail,
  googleLogin,
} = require("./userController");

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);
router.post("/verifyEmailToken", verifyEmailToken);
router.post("/resend", resendEmail);
router.get("/logout", logout);
router.get(
  "/usernames",
  passport.authenticate("jwt", { session: false }),
  usernames
);
router.get("/refresh", refresh);
router.post("/login/google", googleLogin);

module.exports = router;
