const Message = require("./messageModel");

module.exports.createMessage = async (userId, content, chatId) => {
  try {
    const message = await Message.create({
      sender: userId,
      content: content,
      chat: chatId,
    });
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findMessages = async (chatId) => {
  try {
    const message = await Message.find({ chat: chatId })
      .populate("sender", "username picture email")
      .populate("chat");
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
