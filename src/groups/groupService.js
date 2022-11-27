const Group = require("./groupModel");

module.exports.findUserGroups = async (userId) => {
  try {
    const foundGroup = await Group.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("groupname")
      .populate("users", "username picture")
      .populate("groupAdmin", "username")
      .populate("groupOwner", "username")
      .sort({ updateAt: -1 });

    return foundGroup;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findGroupById = async (groupId) => {
  try {
    const foundGroup = await Group.findById(groupId)
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    return foundGroup;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findGroupByToken = async (groupToken) => {
  try {
    const foundGroup = await Group.findOne({ token: groupToken });
    return foundGroup;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.createGroup = async (data) => {
  try {
    const createdGroup = await Group.create({
      groupname: data.groupname,
      users: [data.user],
      groupOwner: data.user,
      groupAdmin: [data.user],
    });
    const newGroup = await Group.findOne({ _id: createdGroup._id })
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    return newGroup;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.deleteGroup = async (userId, groupId) => {
  try {
    const deleted = await Group.deleteOne({
      _id: groupId,
      groupOwner: { $eq: userId },
    });
    if (!deleted) {
      return {
        message: "something goes wrong when removing a group!",
      };
    } else return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.addUserToGroup = async (groupId, userId) => {
  try {
    const added = await Group.findOneAndUpdate(
      {
        _id: groupId,
        users: { $not: { $elemMatch: { $eq: userId } } },
      },
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    if (!added) {
      return {
        message: "failed because you are already in the Group!",
      };
    } else return { added, message: "successful" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.removeUserToGroup = async (groupId, userId) => {
  try {
    const removed = await Group.findOneAndUpdate(
      {
        _id: groupId,
        groupOwner: { $not: { $eq: userId } },
      },
      {
        $pull: { users: userId, groupAdmin: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    if (!removed) {
      return {
        message:
          "cannot remove the user/admin or the user do not in the Group!",
      };
    } else return removed;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.giveUserAdmin = async (groupId, userId) => {
  try {
    const admined = await Group.findOneAndUpdate(
      {
        _id: groupId,
        users: { $elemMatch: { $eq: userId } },
        groupAdmin: { $not: { $elemMatch: { $eq: userId } } },
      },
      {
        $push: { groupAdmin: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    if (!admined) {
      return {
        message: "Something wrong when moderating someone!",
      };
    } else return admined;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.removeUserAdmin = async (groupId, userId) => {
  try {
    const noAdmin = await Group.findOneAndUpdate(
      {
        _id: groupId,
        users: { $elemMatch: { $eq: userId } },
        groupOwner: { $not: { $eq: userId } },
        groupAdmin: { $elemMatch: { $eq: userId } },
      },
      {
        $pull: { groupAdmin: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "username picture")
      .populate("groupOwner", "username")
      .populate("groupAdmin", "username");
    if (!noAdmin) {
      return {
        message: "Something wrong when removing admin!",
      };
    } else return noAdmin;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
