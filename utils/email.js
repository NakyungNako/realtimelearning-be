const nodemailer = require("nodemailer");
const {
  EMAIL_VERIFIER,
  EMAIL_VERIFIER_PWD,
  CLIENT_URL,
} = require("../config/env");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

module.exports.verifyUserEmail = async (username, userEmail, token) => {
  try {
    console.log(transporter);
    let info = await transporter.sendMail({
      from: EMAIL_VERIFIER,
      to: userEmail,
      subject: "Email verification!!!",
      html: `<p>Verify your email address to complete the signup and login to your account.</p><p>This link <b>expires in 1 hour</b>.</p><p>Press <a href=${
        CLIENT_URL + "/verifyUserEmail/" + username + "/" + token
      }>here</a> to proceed.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendInviteLink = async (userEmail, token) => {
  try {
    let info = await transporter.sendMail({
      from: EMAIL_VERIFIER,
      to: userEmail,
      subject: "Invitation!!!",
      html: `<p>welcome, buddy! This is the invitation for you.</p><p>Press <a href=${
        CLIENT_URL + "/joingroup/" + token
      }>here</a> to proceed.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};
