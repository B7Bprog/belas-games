const {
  selectCommentsByReview,
  insertComment,
} = require("../models/comment-model");

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReview(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  console.log("req.body " + req.body);
  insertComment(review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
