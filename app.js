const { getCategories } = require("./controllers/category-controller.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found." });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error! DEBUGGING");
});

module.exports = app;
