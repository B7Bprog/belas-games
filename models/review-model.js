const connection = require("../db/connection");

exports.selectReviewByID = (review_id) => {
  return connection
    .query("SELECT * FROM reviews WHERE review_id=$1;", [review_id])
    .then((result) => {
      // console.log("error here: " + JSON.stringify(err));
      //console.log("this is result.rows" + result.rows);
      console.log(result);
      if (result.rowCount === 0) {
        console.log("inside reject");
        return Promise.reject({
          status: 404,
          msg: `ID ${review_id} does not exist.`,
        });
      }
      return result.rows[0];
    });
};
