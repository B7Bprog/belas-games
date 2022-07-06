const connection = require("../db/connection");

exports.selectCommentsByReview = async (review_id) => {
  const firstQuery = await connection.query(
    `SELECT * FROM comments WHERE comments.review_id = $1;`,
    [review_id]
  );

  if (firstQuery.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Review with ID ${review_id} has no comments.`,
    });
  }
  return firstQuery.rows;
};
