const connection = require("../db/connection");

exports.selectUsers = () => {
  return connection.query("SELECT * FROM users;").then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `ID ${review_id} does not exist.`,
      });
    }
    return result.rows;
  });
};
