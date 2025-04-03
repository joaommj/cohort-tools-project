const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;
const Cohort = require("./models/cohort.model");
const mongoose = require("mongoose");
const Students = require("./models/students.model");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...

app.use(
  cors({
    origin: ["http://localhost:5173", "http://example.com"], // Add the URLs of allowed origins to this array
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohorts);
// });

//!ROUTES FOR COHORTS

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((allCohorts) => {
      console.log("Retrieved allCohorts ->", allCohorts);
      res.json(allCohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving allCohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve" });
    });
});

//POST (create) Rafa
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((createdCohort) => {
      console.log("Created Cohort", createdCohort);
      res.status(200).json(createdCohort);
    })
    .catch((Error) => {
      console.log("Problem creating Cohort");
      res.status(500).json({ Error: "Cohort not Created" });
    });
});

//GET Alfonso
app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId).then((oneCohort) => {
    console.log("One cohort:", oneCohort);
    res.status(200).json(oneCohort);
  });
});
//GET by ID Krists

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((filteredCohort) => {
      console.log(`Here is ${cohortId} cohort!`);
      res.status(200).json(filteredCohort);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: `Cohort ${cohortId} not found!` });
    });
});

// Joao
app.patch("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      //with the update you need to say that you want the new info
      { new: true }
    );
    console.log("here is the updated cohort:", updatedCohort);
    res.status(200).json(updatedCohort);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "trouble updating cohort" });
  }
});
// Delete
app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohort } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      res.status(200).json(deletedCohort);
    })

    .catch((error) => {
      console.log("Cohort not deleted");
      res.status(500).json({ Error: "Problem deleting Cohort" });
    });
});

//ROUTES FOR STUDENTS

app.get("/api/students", (req, res) => {
  Students.find({})
    .populate("cohort")
    .then((allStudents) => {
      console.log("Retrieved allStudents ->", allStudents);
      res.json(allStudents);
    })
    .catch((error) => {
      console.error("Error while retrieving allStudents ->", error);
      res.status(500).json({ error: "Failed to retrieve" });
    });
});

//CREATING NEW STUDENT---POST

app.post("/api/students", (req, res) => {
  Students.create(req.body)

    .then((newStudent) => {
      console.log("we got a new Student", newStudent);
      res.status(201).json(newStudent);
    })

    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "We didn't create the new Student" });
    });
});

//GETTING ALL STUDENTS BY COHORT ID

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Students.find({ cohort: cohortId })
    .populate("cohort")
    .then((filteredStudents) => {
      console.log("here is the student by cohorts");
      res.status(200).json(filteredStudents);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Filtered students NOT FOUND" });
    });
});

// ROUTE TO GET A SINGLE STUDENT
app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Students.findById(studentId)
    .populate("cohort")
    .then((oneStudent) => {
      console.log("One student:", oneStudent);
      res.status(200).json(oneStudent);
    });
});

app.patch("/api/students/:studentId", async (req, res) => {
  try {
    const updatedStudent = await Students.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      //with the update you need to say that you want the new info
      { new: true }
    );
    console.log("here is the updated student:", updatedStudent);
    res.status(200).json(updatedStudent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "trouble updating Student" });
  }
});

//**************************ROUTE TO DELETE STUDENT BY ID

app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Students.findByIdAndDelete(studentId).then((deletedStudent) => {
    console.log("Deleted student:", deletedStudent);
    res.status(204).json(deletedStudent);
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
