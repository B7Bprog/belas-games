const connection = require("../db/connection");

exports.selectCategory = () => {
  return connection
    .query("SELECT * FROM categories;")
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
