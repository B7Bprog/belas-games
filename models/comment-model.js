const connection = require("../db/connection");

exports.selectCommentsByReview = async (review_id) => {
  const commentQuery = await connection.query(
    `SELECT * FROM comments WHERE comments.review_id = $1;`,
    [review_id]
  );
  const idQuery = await connection.query(
    `SELECT * FROM reviews WHERE review_id = ${review_id};`
  );
  if (idQuery.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Review with ID ${review_id} is not found.`,
    });
  }
  return commentQuery.rows;
};
