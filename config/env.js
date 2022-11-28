require("dotenv").config();

module.exports.JWT_SECRET = process.env.JWT_SECRET;

module.exports.JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET;

module.exports.CLIENT_URL = process.env.CLIENT_URL;

module.exports.EMAIL_VERIFIER = process.env.EMAIL_VERIFIER;

module.exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
