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

module.exports.registerUser = async (data) => {
  try {
    await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      registerType: "registered",
    });
    return { message: "Register new user successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Some error occurred while creating User!",
    };
  }
};
