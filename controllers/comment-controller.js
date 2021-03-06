const {
  selectCommentsByReview,
  insertComment,
  eraseComment,
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

  insertComment(review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  eraseComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
