const {
  selectReviewByID,
  updateReview,
  selectReviews,
} = require("../models/review-model");

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;

  selectReviewByID(review_id)
    .then((review) => {
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
      if (!review.votes) {
        next();
      }
      if (typeof review.votes !== "number") {
        next();
      }
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
