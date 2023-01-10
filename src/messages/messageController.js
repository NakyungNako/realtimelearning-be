const {
  findChatByName,
  findAndUpdateMessage,
} = require("../chats/chatService");
const User = require("../users/userModel");
const { createMessage, findMessages } = require("./messageService");

module.exports.sendMessage = async (req, res) => {
  const { chatName, userId, content } = req.body;
  const chat = await findChatByName(chatName);
  try {
    let message = await createMessage(userId, content, chat._id);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await findAndUpdateMessage(chat._id, message);
    return res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.allMessages = async (req, res) => {
  const chat = await findChatByName(req.body.chatName);
  const messages = await findMessages(chat._id);
  if (messages) return res.status(200).json(messages);
  else return res.status(404);
};
