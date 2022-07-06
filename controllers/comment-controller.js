const { selectCommentsByReview } = require("../models/comment-model");

exports.getCommentsByReview = (req, res, next) => {
  console.log("inside comment controller func");
  const { review_id } = req.params;
  console.log("this is review_id: " + review_id);
  selectCommentsByReview(review_id)
    .then((comments) => {
      console.log("these are comments: " + comments);
      res.status(200).send({ comments });
    })
    .catch(next);
};
