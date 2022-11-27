const { GOOGLE_CLIENT_ID } = require("../config/env");
const { OAuth2Client } = require("google-auth-library");

module.exports.verifyGoogleToken = async (token) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    console.log("Invalid user detected. Please try again");
    return { error: "Invalid user detected. Please try again" };
  }
};
