const { selectReviewByID, updateReview } = require("../models/review-model");

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;

  selectReviewByID(review_id)
    .then((review) => {
      // console.log({ review });
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  if (!req.body.hasOwnProperty("inc_votes")) {
    next({ msg: `Bad Request` });
  }
  updateReview(review_id, req.body)
    .then((review) => {
      console.log("review: " + JSON.stringify(review.votes));
      if (!review.votes) {
        next();
      }
      console.log(typeof review.votes);
      if (typeof review.votes !== "number") {
        next();
      }
      res.status(200).send({ review });
    })
    .catch(next);
};
