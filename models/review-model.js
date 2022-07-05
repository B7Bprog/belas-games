const connection = require("../db/connection");

exports.selectReviewByID = (review_id) => {
  return connection
    .query(
      "SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes,  COUNT (comments.body) AS comment_count FROM reviews JOIN comments ON comments.review_id = reviews.review_id  WHERE reviews.review_id=$1 GROUP BY reviews.review_id;",
      [review_id]
    )
    .then((result) => {
      console.log(result);
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

/* return connection
.query("SELECT * FROM reviews WHERE review_id=$1;", [review_id])
.then((result) => {
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `ID ${review_id} does not exist.`,
    });
  }
  return result.rows[0];
}); */
