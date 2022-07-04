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
});
