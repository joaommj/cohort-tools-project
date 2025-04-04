const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const arr = req.headers.authorization.split(" ");
  if (arr[0] === "Bearer" && arr[1]) {
    const theToken = arr[1];
    try {
      const decodedToken = jwt.verify(theToken, process.env.TOKEN_SECRET);
      req.payload = decodedToken;
      next();
    } catch (error) {
      res.status(400).json({ Error: "not verified" });
    }
  } else {
    res.status(400).json({ Error: "no token" });
  }
}

module.exports = { isAuthenticated };
