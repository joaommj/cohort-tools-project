// Import for Models
const Users = require("../models/users.model");
const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// First route for Signup

router.post("/signup", (req, res) => {
  const { name, password, email } = req.body;
  const mySalt = bcryptjs.genSaltSync(12);
  const hashedPassword = bcryptjs.hashSync(password, mySalt);
  console.log({ mySalt, hashedPassword, password });

  const hashedUser = {
    name,
    email,
    password: hashedPassword,
  };

  Users.create(hashedUser)
    .then((createdUser) => {
      const userInDB = createdUser;
      userInDB.password = "*****";
      res.status(201).json(userInDB);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMesssage: "Problem creating a user" });
    });
});

// Second route for Login

router.post("/login", async (req, res) => {
  try {
    console.log(process.env.TOKEN_SECRET);
    const foundUser = await Users.findOne({ email: req.body.email });
    if (foundUser) {
      console.log("the user was found", foundUser);
      const doesPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (doesPasswordMatch) {
        const allInfo = {
          _id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name,
        };
        const authToken = jwt.sign(allInfo, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "24h",
        });
        res.status(200).json({ message: "You are logged in now", authToken });
      } else {
        res.status(400).json({ errorMessage: "invalid password" });
      }
    } else {
      res.status(400).json({ errorMessage: "We don't find the user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Problem login in" });
  }
});

// Route for Verifyng

router.get("/verify", isAuthenticated, (req, res) => {
  console.log("Verified", req.payload);
  res.status(200).json({ message: "Logged in", payload: req.payload });
});

// Export Router

module.exports = router;
