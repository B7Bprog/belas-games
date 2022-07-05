const connection = require("../db/connection");

exports.selectReviewByID = (review_id) => {
  return connection
    .query("SELECT * FROM reviews WHERE review_id=$1;", [review_id])
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
    .query("SELECT * FROM reviews WHERE review_id=$1;", [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `ID ${review_id} does not exist.`,
        });
      }
      result.rows[0].votes += inc_votes;
      return result.rows[0];
    });
};
