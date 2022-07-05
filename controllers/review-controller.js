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
  console.log("inside patchReview");
  const { review_id } = req.params;
  updateReview(review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
