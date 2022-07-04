const { getCategories } = require("./controllers/category-controller");
const { getReviewByID } = require("./controllers/review-controller");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found." });
  next();
});

app.use((err, req, res, next) => {
  res.status(404).send(err);
  next();
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error! DEBUGGING");
});

module.exports = app;
