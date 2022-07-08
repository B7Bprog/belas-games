const connection = require("../db/connection");

exports.selectReviewByID = (review_id) => {
  return connection
    .query(
      `SELECT reviews.*,  
      COUNT (comments.body) AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id  
      WHERE reviews.review_id=$1 
      GROUP BY reviews.review_id;`,
      [review_id]
    )
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

exports.updateReview = (review_id, body) => {
  const { inc_votes } = body;
  return connection
    .query(
      "UPDATE reviews SET votes = votes + $2 WHERE review_id=$1 RETURNING *;",
      [review_id, inc_votes]
    )
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

exports.selectReviews = async (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  const allCategories = await connection.query(
    `SELECT * FROM categories WHERE slug=$1;`,
    [category]
  );

  const validSortBy = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  if (validSortBy.indexOf(sort_by.toLowerCase()) === -1) {
    //Checking for valid sort_by query
    return Promise.reject({
      status: 400,
      msg: `Sort_by '${sort_by}' is invalid`,
    });
  }

  const validOrders = ["desc", "asc"];

  if (validOrders.indexOf(order.toLowerCase()) === -1) {
    //Checking for valid order query
    return Promise.reject({
      status: 400,
      msg: `Order '${order}' is invalid`,
    });
  }

  //Sectioning query

  let queryStr = `SELECT reviews.*,  
  COUNT (comments.body) AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id  `;

  let queryValues = [];
  if (category) {
    queryStr += `WHERE reviews.category = $1 `;
    queryValues.push(category);
  }

  queryStr += `GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};`;

  const reviews = await connection.query(queryStr, queryValues);

  if (reviews.rowCount === 0 && allCategories.rowCount === 0) {
    //Checking if category exists
    return Promise.reject({
      status: 404,
      msg: `Category '${category}' does not exist.`,
    });
  }
  return reviews.rows;
};
