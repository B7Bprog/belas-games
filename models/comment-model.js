const connection = require("../db/connection");

exports.selectCommentsByReview = (review_id) => {
  console.log("review_id in model " + review_id);
  return connection
    .query(`SELECT * FROM comments WHERE comments.review_id = $1;`, [review_id])
    .then((result) => {
      console.log("result.rows here: " + result.rows);
      return result.rows;
    });
};
