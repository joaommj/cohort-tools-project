const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;
const Cohort = require("./models/cohort.model");
const students = require("./models/students.model");
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

//ROUTES FOR COHORTS

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

//ROUTES FOR STUDENTS

app.get("/api/students", (req, res) => {
  Cohort.find({})
    .then((allStudents) => {
      console.log("Retrieved allStudents ->", allStudents);
      res.json(allStudents);
    })
    .catch((error) => {
      console.error("Error while retrieving allStudents ->", error);
      res.status(500).json({ error: "Failed to retrieve" });
    });
});

//CREATING NEW STUDEN---POST

app.post("/api/students", (req,res)=> {

Students.create(req.body)

.then((newStudent) =>{

  console.log("we got a new Student", newStudent);
  res.status(201).json(newStudent);
})

.catch((err)=>{
console.log(err)
res.status(500).json({errorMessage: "We didnt create the new Student"});

});
})

//GETTING ALL STUDENTS BY ID

app.get("/api/students/cohort/:cohortId", (req, res)=>{

const {cohortId}=req.params
Students.find({cohort:cohortId})

.then((filteredStudents)=>{

console.log("here is the student by cohorts");
res.status(200).json(filteredStudents)

})
.catch((err)=>{
  console.log(err);
  res.status(500).json({errorMessage: "Filtered students NOT FOUND"})
}) 

})



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
