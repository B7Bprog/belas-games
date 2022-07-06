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

exports.insertComment = (review_id, updates) => {
  const { username, body } = updates;
  const d = new Date();
  let time = d.getTime();
  console.log(time);
  return connection
    .query(
      `INSERT INTO comments (author, body, votes, review_id, created_at)VALUES ($1,$2, $3, $4, $5) RETURNING *;`,
      [username, body, 0, review_id, new Date(time)]
    )
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
