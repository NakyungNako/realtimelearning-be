const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.header("Access-Control-Allow-Credentials", true);
  // }
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
};

module.exports = credentials;
