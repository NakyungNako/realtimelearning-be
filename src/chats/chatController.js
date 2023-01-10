const { findOneById } = require("../users/userService");
const {
  createChat,
  findChatByName,
  findAndUpdateChatUser,
} = require("./chatService");

module.exports.createGroupChat = async (req, res) => {
  let users = new Array();
  const { chatName, userId } = req.body;
  const user = await findOneById(userId);
  users.push(user);

  try {
    const foundGroup = await findChatByName(chatName);
    if (foundGroup != null) {
      const added = await findAndUpdateChatUser(foundGroup._id, userId);
      if (!added) {
        return res.status(200).json(foundGroup);
      } else {
        return res.status(200).json(added);
      }
    } else {
      const group = await createChat(chatName, users, user);
      return res.status(200).json(group);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatName, userId } = req.body;
  const foundGroup = await findChatByName(chatName);
  const added = await findAndUpdateChatUser(foundGroup._id, userId);
  if (!added) {
    res.status(200).json(foundGroup);
  } else {
    res.status(200).json(added);
  }
};
