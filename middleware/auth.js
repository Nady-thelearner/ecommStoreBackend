const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["authorization"] ||
    req.headers.authorization;
  // console.log("token...", token);
  if (!token) {
    res.status(200).send({
      success: false,
      message: "A token is required for authentication",
    });
  }

  try {
    const decode = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decode;
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
