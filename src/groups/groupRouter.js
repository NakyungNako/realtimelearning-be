const express = require("express");
const {
  groups,
  newGroup,
  addUser,
  addAdmin,
  removeUser,
  removeAdmin,
  deleteGroup,
  createToken,
  giveOwner,
  sendLinkToUserEmail,
  privatePresentCheck,
} = require("./groupController");
const passport = require("passport");
const passportConfig = require("../../middleware/passport");

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  newGroup
);
router.post("/delete", deleteGroup);
router.post("/createToken", createToken);
router.post("/sendinvitation", sendLinkToUserEmail);
router.post("/privateCheck", privatePresentCheck);
router.get("/", passport.authenticate("jwt", { session: false }), groups);
router.put("/add", passport.authenticate("jwt", { session: false }), addUser);
router.put(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  removeUser
);
router.put("/addadmin", addAdmin);
router.put("/removeadmin", removeAdmin);
router.put("/giveowner", giveOwner);

module.exports = router;
