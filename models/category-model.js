const connection = require("../db/connection");

exports.requestCategory = () => {
  return connection
    .query("SELECT * FROM categories;")
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
