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
  console.log("in modelfunc");
  const { username, body } = updates;
  const d = new Date();
  let time = d.getTime();
  console.log(username);

  const checkUsernames = await connection.query(
    `SELECT * FROM users WHERE username=$1;`,
    [username]
  );
  console.log(checkUsernames.rows);

  if (checkUsernames.rowCount === 0) {
    console.log("inside reject");
    return Promise.reject({
      status: 404,
      msg: `User ${username} is not found.`,
    });
  }
  /*  
  const checkUsernames = await connection.query(`SELECT * FROM users;`);
  console.log(checkUsernames.rows);
  const found = checkUsernames.rows.find(
    (user) => user.username === `${username}`
  );

  if (!found) {
    return Promise.reject({
      status: 404,
      msg: `User ${review_id} is not found.`,
    });
  } */
  const mainQuery = await connection.query(
    `INSERT INTO comments (author, body, votes, review_id, created_at)VALUES ($1,$2, $3, $4, $5) RETURNING *;`,
    [username, body, 0, review_id, new Date(time)]
  );

  return mainQuery.rows[0];
};
