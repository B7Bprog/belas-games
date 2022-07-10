const endpoints = require("../endpoints.json");

exports.fetchEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints: endpoints });
};
