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

exports.insertComment = async (review_id, updates) => {
  const { username, body } = updates;

  if (!body) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  const checkUsernames = await connection.query(
    `SELECT * FROM users WHERE username=$1;`,
    [username]
  );

  if (typeof username !== "string") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  if (checkUsernames.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `User ${username} is not found.`,
    });
  }

  const mainQuery = await connection.query(
    `INSERT INTO comments (author, body, review_id)VALUES ($1,$2,$3) RETURNING *;`,
    [username, body, review_id]
  );

  return mainQuery.rows[0];
};
