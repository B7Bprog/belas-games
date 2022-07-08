const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const { string } = require("pg-format");

beforeEach(() =>
  seed({
    categoryData,
    commentData,
    reviewData,
    userData,
  })
);

afterAll(() => db.end());
//GET /api/categories ///////////////////////////////////////////////////////////////
describe("NC-Games app", () => {
  describe("GET /api/categories", () => {
    test("Responds with status 200 and an array of categories with length 4 and checks for correct properties.", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
    test("Responds with status 404 'Not found.' .", () => {
      return request(app)
        .get("/api/WRONGPATH")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found.");
        });
    });
  });
  //GET /api/reviews/:review_id /////////////////////////////////////////////////////
  describe("GET /api/reviews/:review_id", () => {
    test("Returns 200, responds with a single review object, which is not an array and has the right properties.", () => {
      //Arrange
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_body");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("comment_count");

          expect(Array.isArray(review)).toBe(false);
        });
    });
    test("Responds with status 404 'Not found' and a custom error message, when passed the wrong id.", () => {
      const review_id = 9999;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`ID ${review_id} does not exist.`);
        });
    });
    test("Responds with status 400 'Bad Request' when passed something that's not an ID.", () => {
      const review_id = "h$nmP^";
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Bad Request`);
        });
    });
    test("Responds with status 200 and a review object containing comment-count.", () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveProperty("comment_count");
        });
    });
    test("Responds with status 200 and a review object containing the right comment-count.", () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: "3",
          });
        });
    });
    test("Responds with status 200 and a review object containing comment-count: 0 where there are no comments.", () => {
      const review_id = 4;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;

          expect(review).toEqual({
            review_id: 4,
            title: "Dolor reprehenderit",
            designer: "Gamey McGameface",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            review_body:
              "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
            category: "social deduction",
            created_at: "2021-01-22T11:35:50.936Z",
            votes: 7,
            comment_count: "0",
          });
        });
    });
  });
  //PATCH /api/reviews/:review_id //////////////////////////////////////////////////
  describe(" PATCH /api/reviews/:review_id", () => {
    const review_id = 3;
    test("Status 200 responds with the updated review.", () => {
      const incrementVotes = { inc_votes: 1 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(incrementVotes)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 6,
          });
        });
    });
    test("Responds with Status 404 'Not Found'.", () => {
      const incrementVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/reviews/5555")
        .send(incrementVotes)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`ID 5555 does not exist.`);
        });
    });
    test("Responds with Status 400 'Not Found' when passed in the wrong property.", () => {
      const incrementVotes = { inc_SOMETHING: 1 };
      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(incrementVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Bad Request`);
        });
    });
    test("Responds with Status 400 'Bad Request' when passed in invalid value.", () => {
      const incrementVotes = { inc_votes: "hello" };
      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(incrementVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Bad Request`);
        });
    });
  });
  //GET /api/users ///////////////////////////////////////////////////////////////
  describe("GET /api/users", () => {
    test("Responds with status code 200 and an array of objects, each object should have 'username', 'name' and 'avatar_url' property.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(4);
          users.forEach((category) => {
            expect(category).toHaveProperty("username");
            expect(category).toHaveProperty("name");
            expect(category).toHaveProperty("avatar_url");
          });
        });
    });
    test("Responds with status 404 'Not found.' .", () => {
      return request(app)
        .get("/api/WRONGPATH")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found.");
        });
    });
  });
  //GET /api/reviews ////////////////////////////////////////////////////////////////
  describe("GET /api/reviews", () => {
    test("Responds with status code 200 and an array.", () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(Array.isArray(reviews)).toBe(true);
        });
    });
    test("Responds with status code 200 and an array of objects sorted by date in descending order.", () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Responds with status code 200 and an array of objects with the right properties.", () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("review_body");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("comment_count");
          });
        });
    });
    test("Responds with status code 200 and an array of objects sorted by 'title' in descending order.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=title`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("title", {
            //descending: false,
            compare: function sortTitle(a, b) {
              return b - a;
            },
          });
        });
    });
    test("Responds with status code 200 and an array of objects sorted by 'votes' in ascending order.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes&order=asc`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("votes", {
            //descending: false,
            compare: function sort(a, b) {
              return a - b;
            },
          });
        });
    });
    test("Responds with status code 200 and an array of objects of a specific category sorted by 'designer' in ascending order.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=designer&order=asc&category=dexterity`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("designer", {
            //descending: false,
            compare: function sort(a, b) {
              //asc: a-b
              return a - b;
            },
          });
          expect(reviews).toEqual([
            {
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 5,
              comment_count: "3",
            },
          ]);
        });
    });
    test("Responds with status code 200 and an array of objects of a specific category sorted by 'owner' in descending order and the array has the right number of items.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=owner&category=social deduction`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("owner", {
            //descending: false,
            compare: function sort(a, b) {
              //asc: a-b
              return a - b;
            },
          });
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({ category: "social deduction" })
            );
          });
          expect(reviews).toHaveLength(11);
        });
    });
    test("Responds with status code 404 for a non-existent category, where category is the only query.", () => {
      return request(app)
        .get(`/api/reviews?category=gomoku`)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Category 'gomoku' does not exist.`);
        });
    });
    test("Responds with status code 404 for a non-existent category.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=owner&category=gomoku`)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Category 'gomoku' does not exist.`);
        });
    });
    test("Responds with status code 400 for an invalid order query.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=owner&order=backwards`)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Order 'backwards' is invalid`);
        });
    });
    test("Responds with status code 400 for an invalid sort_by query.", () => {
      return request(app)
        .get(`/api/reviews?sort_by=age&order=backwards`)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe(`Sort_by 'age' is invalid`);
        });
    });
    test("Responds with status code 404 when category exists. but there are no relevant reviews.", () => {
      return request(app)
        .get(`/api/reviews?category=children's games`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toEqual([]);
        });
    });
  });
  //GET /api/reviews/:review_id/comments ////////////////////////////////////////////
  describe("GET /api/reviews/:review_id/comments", () => {
    test("Responds with status 200 and an array with the correct properties and the right length.", () => {
      return request(app)
        .get(`/api/reviews/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);

          expect(comments).toHaveLength(3);

          comments.forEach((review) => {
            expect(review).toHaveProperty("comment_id");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("author");
            expect(review).toHaveProperty("body");
            expect(review).toHaveProperty("review_id");
            expect(review.review_id).toBe(2);
          });
        });
    });
    test("Responds with status 200 and an empty array, when passed an ID where there are no comments.", () => {
      return request(app)
        .get(`/api/reviews/6/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("Responds with status 404 Not Found error, when passed wrong ID", () => {
      return request(app)
        .get(`/api/reviews/999/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review with ID 999 is not found.");
        });
    });
    test("Responds with status 400 Bad Request error, when passed an invalid ID", () => {
      return request(app)
        .get(`/api/reviews/hello/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 404 Not Found error, when passed the wrong path.", () => {
      return request(app)
        .get(`/api/reviews/3/WRONG`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found.");
        });
    });
  });
  //POST /api/reviews/:review_id/comments ///////////////////////////////////////////
  describe("POST /api/reviews/:review_id/comments", () => {
    test("Responds with status 201 and the new comment which has all the right properties.", () => {
      const newComment = {
        username: "philippaclaire9",
        body: "Even aliens like this game!",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty("comment_id");
          expect(body.comment).toHaveProperty("votes");
          expect(body.comment).toHaveProperty("created_at");
          expect(body.comment).toHaveProperty("author");
          expect(body.comment).toHaveProperty("body");
          expect(body.comment).toHaveProperty("review_id");
          expect(body.comment).toHaveProperty("created_at");
        });
    });
    test("Responds with status 201 and the new comment with all the right properties when body is a number.", () => {
      const newComment = {
        username: "philippaclaire9",
        body: 33,
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 7,
            body: "33",
            votes: 0,
            author: "philippaclaire9",
            review_id: 3,
            created_at: expect.any(String),
          });
        });
    });
    test("Responds with status 400 Bad Request when 'body' is missing from the request.", () => {
      const newComment = {
        username: "philippaclaire9",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 400 Bad Request when 'username' is missing from the request.", () => {
      const newComment = {
        body: "Even aliens like this game!",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 400 Bad Request when 'body' and 'username' is missing from the request.", () => {
      const newComment = {};
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 404 'Not found.' error, when passed the wrong username.", () => {
      const newComment = {
        username: "SOMEBODY",
        body: "Even aliens like this game!",
      };

      return request(app)
        .post(`/api/reviews/3/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User SOMEBODY is not found.");
        });
    });
    test("Responds with status 400 'Bad Request' error, when the username is the wrong datatype.", () => {
      const newComment = {
        username: 22,
        body: "Even aliens like this game!",
      };

      return request(app)
        .post(`/api/reviews/3/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 404 Not Found error, when passed wrong ID", () => {
      const newComment = {
        username: "philippaclaire9",
        body: "Even aliens like this game!",
      };

      return request(app)
        .post(`/api/reviews/999/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found.");
        });
    });
    test("Responds with status 400 Bad Request error, when passed an invalid ID", () => {
      const newComment = {
        username: "philippaclaire9",
        body: "Even aliens like this game!",
      };

      return request(app)
        .post(`/api/reviews/hello/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Responds with status 404 Not found error, when passed a wrong path.", () => {
      const newComment = {
        username: "philippaclaire9",
        body: "Even aliens like this game!",
      };

      return request(app)
        .post(`/api/reviews/3/commentz`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found.");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("Deleting existing comment.", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("Responds with status 404 when a comment ID doesn't exist in the database.", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment ID '999' does not exist.");
        });
    });
    test("Responds with status 400 when the comment ID is invalid type.", () => {
      return request(app)
        .delete("/api/comments/ID")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
