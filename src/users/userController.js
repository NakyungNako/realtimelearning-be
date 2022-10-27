const { registerValidate } = require("./userValidate");
const {
  findOneByEmail,
  registerUser,
  findOneByUsername,
} = require("./userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    //Validate Registers
    let data = req.body;
    const validated = registerValidate(data);
    if (validated.error != null)
      return res.status(200).json({
        error: true,
        message: validated.error.details[0].message,
      });

    //Check Confirm Password
    if (data.password != data.confirmPassword) {
      return res.status(200).json({
        error: true,
        message: "Confirm password is incorrect",
      });
    }

    //Check Email Exist
    const checkEmailResult = await findOneByEmail(data.email);
    if (checkEmailResult != null) {
      return res.status(200).json({
        error: true,
        message: "Email has already registered",
      });
    }

    //Check Username Exist
    const checkUsernameResult = await findOneByUsername(data.username);
    if (checkUsernameResult != null) {
      return res.status(200).json({
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

    return res.status(201).json({
      error: false,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const data = req.body;
    //Find User In DB
    const user = await findOneByUsername(data.username);
    // console.log(user);
    if (!user) {
      return res.status(200).json({
        error: true,
        message: "The username you entered is not registered.",
      });
    }
    //Check Register type
    // if (user.registerType == "socialLinked") {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Please login with your social account.",
    //   });
    // }
    //Check Password
    console.log("Password " + user.password);
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return res.status(200).json({
        error: true,
        message: "The password you entered is not correct",
      });
    }
    //Check is verified, is lock
    // const isVerified = user.isVerify === true;
    // if (!isVerified) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Your email isn't verified. Please confirm your email.",
    //   });
    // }
    // const isLocked = user.isLock === true;
    // if (isLocked) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Your account is locked.",
    //   });
    // }
    //JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 10000000,
    });
    //res.header("auth-token", token).send(token);

    // const tokenObject = Util.issueJWT(user);
    return res.status(200).send({
      data: token,
      message: "logged in successfully!!!",
    });
  } catch (error) {
    console.log(error);
  }
};
