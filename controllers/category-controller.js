const { selectCategories } = require("../models/category-model.js");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      console.log(categories);
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.log("inside catch");
      next(err);
    });
};
