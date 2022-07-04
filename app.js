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
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  } else return res.status(404).send(err);
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
