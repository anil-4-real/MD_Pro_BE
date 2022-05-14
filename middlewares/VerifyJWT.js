var jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({
          message: "Invalid token",
        });
      } else {
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.name = decoded.name;
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = verifyJwt;
