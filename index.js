const { getCategories } = require("./controllers/category-controller");
const {
  getReviewByID,
  patchReview,
  getReviews,
} = require("./controllers/review-controller");
const { getUsers } = require("./controllers/user-controller");
const {
  getCommentsByReview,
  postComment,
  deleteComment,
} = require("./controllers/comment-controller");

const { fetchEndpoints } = require("./controllers/api-controller");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", fetchEndpoints);

app.use("*", (req, res) => {
  res.status(404).send({
    message: "Belas Games API is running!",
    status: "healthy",
    to_see_all_endpoints_use: "/api",
    github_repo: "https://github.com/B7Bprog/belas-games",
  });
});

app.use((err, req, res, next) => {
  if (
    err.hasOwnProperty("msg") &&
    (err.msg.startsWith("Order") || err.msg.startsWith("Sort_by"))
  ) {
    return res.status(400).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.hasOwnProperty("msg") && err.msg !== "Bad Request")
    return res.status(404).send({ msg: err.msg });
  else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.msg === "Bad Request") {
    return res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.status === 404) return res.status(404).send({ msg: "Not found." });
  else next();
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;

// app.use((err, req, res, next) => {
//   if (
//     err.hasOwnProperty("msg") &&
//     (err.msg.startsWith("Order") || err.msg.startsWith("Sort_by"))
//   ) {
//     return res.status(400).send({ msg: err.msg });
//   }
//   if (err.hasOwnProperty("msg") && err.msg !== "Bad Request")
//     return res.status(404).send(err);
//   if (err.code === "22P02" || err.msg === "Bad Request") {
//     return res.status(400).send({ msg: "Bad Request" });
//   } else return res.status(404).send({ msg: "Not found." });
// });
