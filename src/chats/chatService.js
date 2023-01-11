const Chat = require("./chatModel");

module.exports.createChat = async (chatName, users, user) => {
  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      users: users,
      groupAdmin: user,
    });

    const newGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "username")
      .populate("groupAdmin", "username");
    return newGroupChat;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findChat = async (chatId) => {
  try {
    const groupChat = await Chat.findOne({ _id: chatId })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return groupChat;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findChatByName = async (chatName) => {
  try {
    const groupChat = await Chat.findOne({ chatName: chatName })
      .populate("users", "username")
      .populate("groupAdmin", "username");
    return groupChat;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findAndUpdateChatUser = async (chatId, userId) => {
  try {
    const added = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        users: { $not: { $elemMatch: { $eq: userId } } },
      },
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return added;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findAndUpdateMessage = async (chatId, message) => {
  try {
    const updated = await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
