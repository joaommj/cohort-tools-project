const { isAuthenticated } = require("../middlewares/jwt.middleware");
const Users = require("../models/users.model");
const router = require("express").Router();

// First route get user with verification
router.get("/:userId", isAuthenticated, (req, res) => {
  const { userId } = req.params;
  Users.findById(userId)
    .then((selectedUser) => {
      res.status(200).json(selectedUser);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ errorMessage: "Problem to find the selected user" });
    });
});

// Export Router
module.exports = router;

// // ROUTE TO GET A SINGLE STUDENT
// app.get("/api/students/:studentId", (req, res) => {
//     const { studentId } = req.params;
//     Students.findById(studentId)
//       .populate("cohort")
//       .then((oneStudent) => {
//         console.log("One student:", oneStudent);
//         res.status(200).json(oneStudent);
//       });
//   });
