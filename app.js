const { getCategories } = require("./controllers/category-controller");
const {
  getReviewByID,
  patchReview,
} = require("./controllers/review-controller");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", patchReview);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found." });
  next();
});

app.use((err, req, res, next) => {
  console.log("error here: " + err);
  if (err.hasOwnProperty("msg") && err.msg !== "Bad Request")
    return res.status(404).send(err);
  if (err.code === "22P02" || err.msg === "Bad Request") {
    return res.status(400).send({ msg: "Bad Request" });
  } else return res.status(404).send({ msg: "Not found." });
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
