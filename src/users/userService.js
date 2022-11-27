const User = require("./userModel");

module.exports.findOneByEmail = async (email) => {
  try {
    const foundUser = await User.findOne({ email: email });
    return foundUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findOneByUsername = async (username) => {
  try {
    const foundUser = await User.findOne({ username: username });
    return foundUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.findOneById = async (id) => {
  try {
    const foundUser = await User.findById(id);
    return foundUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.registerUser = async (data) => {
  try {
    await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return { message: "Please check your email for verification" };
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Some error occurred while creating User!",
    };
  }
};

module.exports.findOneByToken = async (token) => {
  try {
    const foundUser = await User.findOne({ refreshToken: token });
    return foundUser;
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Some error occurred while update User!",
    };
  }
};

module.exports.getAllUsernames = async () => {
  try {
    const users = await User.find({}, { username: 1 });
    return users;
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Some error occurred while get Users!",
    };
  }
};

module.exports.updateVerify = async (username) => {
  try {
    const respones = await User.updateOne(
      { username: username },
      {
        $set: {
          verified: true,
        },
      }
    );
    return respones;
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Some error occurred while verifying!",
    };
  }
};

module.exports.findOrCreateGoogleUser = async (
  email,
  givenName,
  familyName,
  picture
) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        username: `${givenName}${familyName}`,
        picture: picture,
        verified: true,
      },
      { new: true, upsert: true }
    );
    if (user) return user;
  } catch (error) {
    console.log("Error signing up", error);
  }
};
