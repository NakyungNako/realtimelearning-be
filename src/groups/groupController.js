const {
  findUserGroups,
  createGroup,
  addUserToGroup,
  giveUserAdmin,
  removeUserToGroup,
  removeUserAdmin,
  deleteGroup,
  findGroupById,
  findGroupByToken,
} = require("./groupService");
const randomstring = require("randomstring");
const { findOneById } = require("../users/userService");
const { emailValidate } = require("../../utils/mailValidate");
const { sendInviteLink } = require("../../utils/Email");

//get all groups of user
module.exports.groups = async (req, res) => {
  try {
    const groups = await findUserGroups(req.query.userId);
    return res.status(200).json(groups);
  } catch (error) {
    console.log(error);
  }
};

//create a new group
module.exports.newGroup = async (req, res) => {
  if (!req.body.groupname || !req.body.user) {
    return res.status(400).json({ messsage: "Please enter something!" });
  }
  const newGroup = await createGroup(req.body);
  return res.status(200).json(newGroup);
};

//delete a group
module.exports.deleteGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const removedGroup = await deleteGroup(userId, groupId);
    if (removedGroup.deletedCount === 1) {
      return res.status(200).json({ messsage: "remove successfully!" });
    } else return res.status(200).json(removedGroup);
  } catch (error) {
    console.log(error);
  }
};

//add user to group
module.exports.addUser = async (req, res) => {
  try {
    const { groupToken, userId } = req.body;
    const foundGroup = await findGroupByToken(groupToken);

    if (foundGroup.expDate - Date.now() <= 0)
      return res
        .status(200)
        .json({ message: "failed because invite link has expired" });

    const addedGroup = await addUserToGroup(foundGroup._id, userId);

    return res
      .status(200)
      .json({ data: addedGroup.added, message: addedGroup.message });
  } catch (error) {
    console.log(error);
  }
};

//remove user out of group
module.exports.removeUser = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const removedUserGroup = await removeUserToGroup(groupId, userId);
    return res.status(200).json(removedUserGroup);
  } catch (error) {
    console.log(error);
  }
};

//give a user an admin
module.exports.addAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const adminGroup = await giveUserAdmin(groupId, userId);
    return res.status(200).json(adminGroup);
  } catch (error) {
    console.log(error);
  }
};

//remove admin from user
module.exports.removeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const removeAdmin = await removeUserAdmin(groupId, userId);
    return res.status(200).json(removeAdmin);
  } catch (error) {
    console.log(error);
  }
};

//create Token for a group invitation
module.exports.createToken = async (req, res) => {
  const groupId = req.body.groupId;
  const foundGroup = await findGroupById(groupId);
  const prevDate = new Date(foundGroup.expDate);
  if (foundGroup.token && prevDate - Date.now() > 3600000)
    return res.status(200).json({ token: foundGroup.token });
  const token = randomstring.generate(8);
  const date = new Date();
  const expDate = date.setDate(date.getDate() + 1);

  foundGroup.token = token;
  foundGroup.expDate = expDate;
  await foundGroup.save();

  return res.status(200).json({ token: token });
};

//give Owner to other users
module.exports.giveOwner = async (req, res) => {
  const { groupId, userId } = req.body;
  const foundGroup = await findGroupById(groupId);
  const foundUser = await findOneById(userId);
  const adminList = foundGroup.groupAdmin;
  const isAdmin = adminList.some((e) => {
    if (e.username === foundUser.username) {
      return true;
    }
    return false;
  });

  if (isAdmin) {
    foundGroup.groupOwner = foundUser;
  } else {
    foundGroup.groupOwner = foundUser;
    foundGroup.groupAdmin.push(foundUser);
  }

  await foundGroup.save();

  const shortGroup = await findGroupById(groupId);

  return res.status(200).json(shortGroup);
};

module.exports.sendLinkToUserEmail = async (req, res) => {
  const { groupId, userEmail } = req.body;
  const foundGroup = await findGroupById(groupId);
  const groupToken = foundGroup.token;
  const validated = emailValidate(userEmail);
  if (validated.error != null) {
    return res.status(200).json({
      error: true,
      message: validated.error.details[0].message,
    });
  }
  sendInviteLink(userEmail, groupToken);
  return res.status(200).json({ message: "Email Sent!" });
};
