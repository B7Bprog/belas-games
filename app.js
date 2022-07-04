const { getCategory } = require("./controllers/category-controller.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategory);

module.exports = app;
