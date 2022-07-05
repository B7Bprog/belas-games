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

beforeEach(() =>
  seed({
    categoryData,
    commentData,
    reviewData,
    userData,
  })
);

afterAll(() => db.end());

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

          expect(review).toEqual({
            review_id: review_id,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          });

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
  });
  describe(" PATCH /api/reviews/:review_id", () => {
    const review_id = 3;
    test("Status 200 responds with the updated review.", () => {
      const incrementVotes = { inc_votes: 1 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(incrementVotes)
        .expect(200)
        .then(({ body }) => {
          console.log("in test in .then");
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
            //...updatedReview,
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
});
