const { registerValidate } = require("./userValidate");
const {
  findOneByEmail,
  registerUser,
  findOneByUsername,
  findOneByToken,
  getAllUsernames,
} = require("./userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env");

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

module.exports.login = async (req, res) => {
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
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: 10 }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    //res.header("auth-token", token).send(token);
    res.cookie("jwt", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    // const tokenObject = Util.issueJWT(user);
    return res.status(200).send({
      token: token,
      username: user.username,
      id: user.id,
      message: "logged in successfully!!!",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await findOneByToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt");
    return res.status(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt");
  res.status(204);
};

module.exports.usernames = async (req, res) => {
  try {
    const users = await getAllUsernames();
    return res.status(200).json(users);
    console.log("ahihi");
  } catch (error) {
    console.log(error);
  }
};

module.exports.refresh = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const user = await findOneByToken(cookies.jwt);
  if (user) {
    const refreshToken = req.cookies.jwt;
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // Wrong Refesh Token
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        const username = user.username;
        // Correct token we send a new access token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: 10 }
        );
        return res.json({ username, token });
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};
