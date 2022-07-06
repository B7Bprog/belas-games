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
          console.log(review);
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
  describe("GET /api/reviews", () => {
    test("Responds with status code 200 and an array.", () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(Array.isArray(reviews)).toBe(true);
        });
      /*  test("Responds with status code 200 and an array of objects sorted by date in descending order.", () => {
      //Arrange
      const input = testInput;
      const expected = testExpectedReturn;
      //Act
      const actual = nameOfFunctionToTest(input);
      //Assert
      expect(actual).toBe(expected);
    }); */
    });
  });
});
