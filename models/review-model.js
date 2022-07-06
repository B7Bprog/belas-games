const connection = require("../db/connection");

exports.selectReviewByID = (review_id) => {
  return connection
    .query(
      `SELECT reviews.*,  
      COUNT (comments.body) AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id  
      WHERE reviews.review_id=$1 
      GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `ID ${review_id} does not exist.`,
        });
      }
      return result.rows[0];
    });
};

exports.updateReview = (review_id, body) => {
  const { inc_votes } = body;
  return connection
    .query(
      "UPDATE reviews SET votes = votes + $2 WHERE review_id=$1 RETURNING *;",
      [review_id, inc_votes]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `ID ${review_id} does not exist.`,
        });
      }
      //result.rows[0].votes += inc_votes;
      return result.rows[0];
    });
};

exports.selectReviews = () => {
  return connection
    .query(
      `SELECT reviews.*,  
  COUNT (comments.body) AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id  
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`
    )
    .then((result) => {
      console.log("result rows " + result.rows);
      return result.rows;
    });
};
