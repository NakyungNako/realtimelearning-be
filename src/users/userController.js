const { registerValidate } = require("./userValidate");
const {
  findOneByEmail,
  registerUser,
  findOneByUsername,
} = require("./userService");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    //Validate Registers
    let data = req.body;
    const validated = registerValidate(data);
    if (validated.error != null)
      return res.status(400).json({
        error: true,
        message: validated.error.details[0].message,
      });

    //Check Confirm Password
    if (data.password != data.confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Confirm password is incorrect",
      });
    }

    //Check Email Exist
    const checkEmailResult = await findOneByEmail(data.email);
    if (checkEmailResult != null) {
      return res.status(400).json({
        error: true,
        message: "Email has already registered",
      });
    }

    //Check Username Exist
    const checkUsernameResult = await findOneByUsername(data.username);
    if (checkUsernameResult != null) {
      return res.status(400).json({
        error: true,
        message: "Username has been taken",
      });
    }

    //HashPassword
    const password = data.password;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    data.password = await bcrypt.hash(password, salt);

    //Register new User
    const result = await registerUser(data);
    if (result.error) {
      res.status(500).send({
        message: result.error,
      });
      return;
    }

    return res.status(200).json({
      error: false,
      message: result,
    });
  } catch (e) {
    next(e);
  }
};
