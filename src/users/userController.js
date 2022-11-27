const { registerValidate } = require("./userValidate");
const {
  findOneByEmail,
  registerUser,
  findOneByUsername,
  findOneByToken,
  getAllUsernames,
  updateVerify,
  findOrCreateGoogleUser,
} = require("./userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EMAIL_SECRET,
  GOOGLE_CLIENT_ID,
} = require("../../config/env");
const { verifyUserEmail } = require("../../utils/Email");
const { verifyGoogleToken } = require("../../utils/verifyGoogleToken");

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
    const emailToken = jwt.sign({ username: data.username }, JWT_EMAIL_SECRET, {
      expiresIn: "1h",
    });

    verifyUserEmail(data.username, data.email, emailToken);

    return res.status(201).json({
      error: false,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.resendEmail = async (req, res) => {
  const foundUser = await findOneByUsername(req.body.username);
  const emailToken = jwt.sign(
    { username: foundUser.username },
    JWT_EMAIL_SECRET,
    {
      expiresIn: 20,
    }
  );

  verifyUserEmail(foundUser.username, foundUser.email, emailToken);
  return res.status(201).json({
    message: "Verification has been sent to your email. Please check",
  });
};

module.exports.verifyEmailToken = async (req, res) => {
  const foundUser = await findOneByUsername(req.body.username);
  if (!foundUser)
    return res.status(406).json({ message: "cannot find the user" });
  jwt.verify(req.body.emailToken, JWT_EMAIL_SECRET, async (err, decoded) => {
    if (err) {
      // Wrong Email Token
      return res.status(406).json({ message: "Unauthorized" });
    } else {
      console.log(decoded);
      const response = await updateVerify(req.body.username);
      return res.json({ response, message: "okay" });
    }
  });
};

module.exports.login = async (req, res) => {
  try {
    const data = req.body;
    //Find User In DB
    const user = await findOneByUsername(data.username);

    if (!user) {
      return res.status(200).json({
        error: true,
        message: "The username you entered is not registered.",
      });
    }

    //Check Password
    console.log("Password " + user.password);
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return res.status(200).json({
        error: true,
        message: "The password you entered is not correct",
      });
    }

    if (!user.verified) {
      return res.status(200).json({
        error: true,
        message: "Your Email is not verified",
      });
    }

    //JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: 10 }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1h" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      token: token,
      username: user.username,
      id: user.id,
      email: user.email,
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
    res.clearCookie("jwt", { httpOnly: true, secure: true });
    return res.status(204).json({ message: "cannot find user" });
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, secure: true });
  res.status(204).json({ message: "logout success" });
};

module.exports.usernames = async (req, res) => {
  try {
    const users = await getAllUsernames();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

module.exports.refresh = async (req, res) => {
  const cookies = req.cookies;
  console.log("refresh", cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const user = await findOneByToken(cookies.jwt);
  if (user) {
    const refreshToken = req.cookies.jwt;
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // Wrong Refesh Token
        return res
          .status(406)
          .json({ message: "Unauthorized - wrong Refresh Token" });
      } else {
        const username = user.username;
        const id = user.id;
        // Correct token we send a new access token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: 10 }
        );
        return res.json({ id, username, token });
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized - Cannot find user" });
  }
};

module.exports.googleLogin = async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const googleUser = await findOrCreateGoogleUser(
        profile.email,
        profile.given_name,
        profile.family_name,
        profile.picture
      );

      const token = jwt.sign(
        { id: googleUser.id, username: googleUser.username },
        JWT_SECRET,
        { expiresIn: 10 }
      );

      const refreshToken = jwt.sign(
        { username: googleUser.username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1h" }
      );

      googleUser.refreshToken = refreshToken;
      await googleUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).send({
        token: token,
        username: googleUser.username,
        id: googleUser.id,
        picture: googleUser.picture,
        email: googleUser.email,
        message: "logged in successfully!!!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
};
