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
} = require("./groupController");

const router = express.Router();

router.post("/create", newGroup);
router.post("/delete", deleteGroup);
router.post("/createToken", createToken);
router.post("/sendinvitation", sendLinkToUserEmail);
router.get("/", groups);
router.put("/add", addUser);
router.put("/remove", removeUser);
router.put("/addadmin", addAdmin);
router.put("/removeadmin", removeAdmin);
router.put("/giveowner", giveOwner);

module.exports = router;
