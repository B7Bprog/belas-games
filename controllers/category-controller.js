const { requestCategory } = require("../models/category-model.js");

exports.getCategory = (req, res) => {
  requestCategory().then((categories) => {
    console.log(categories);
    res.status(200).send({ categories });
  });
};
