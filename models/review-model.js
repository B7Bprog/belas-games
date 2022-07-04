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
