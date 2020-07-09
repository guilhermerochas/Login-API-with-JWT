const jwt = require("jsonwebtoken");
const dotenv = require("dotenv/config");

console.log(process.env.SECRET_TOKEN);

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verify = jwt.verify(token, process.env.SECRET_TOKEN);
    res.send(verify);
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
