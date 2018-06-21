process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const seedDB = require("../seed/seed");
const testData = require("../seed/testData");
const mongoose = require("mongoose");

let topicDocs;
let articleDocs;
let userDocs;
let commentsDocs;

describe("NC NEWS", function() {
  //seeding the DB before each test, and dropping it. Setting up access to the params in docs
  this.timeout(5000);
  beforeEach(() => {
    return seedDB(testData).then(docs => {
      [commentsDocs, userDocs, articleDocs, topicDocs] = docs;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });

  // describe('/') html page like index of all end points
  // topics routes
  describe("/topics", () => {
    it("GET all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          const topics = res.body.topics;
          expect(topics.length).to.equal(2);
          expect(topics[0]).to.include.keys("title", "slug");
        });
    });
  });
  describe("/topics/:topic_slug/articles", () => {
    it("GET all articles by topic", () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then(res => {
          const articles = res.body.articles;
          expect(articles.length).to.equal(2);
          expect(articles[0]).to.include.keys(
            "created_by",
            "comments",
            "votes"
          );
          expect(articles[0].belongs_to).to.equal(`${topicDocs[0].slug}`);
        });
    });
  });
  describe("/topics/:topic_slug/articles", () => {
    it("POST add a new article to a topic", () => {
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send({
          title: "My very first blog post",
          created_by: userDocs[0]._id,
          body: "ehmegerd post"
        })
        .expect(201)
        .then(res => {
          const article = res.body.newArticle;
          expect(article).to.include.keys("created_by", "belongs_to");
          expect(article.belongs_to).to.equal(`${topicDocs[0].slug}`);
        });
    });
  });
  //articles
  describe("/articles", () => {
    it("GET all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          const articles = res.body.articles;
          expect(articles.length).to.equal(4);
          expect(articles[0]).to.include.keys("created_by", "comments", "body");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET article by ID", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          const article = res.body.article;
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
          expect(article).to.include.keys("created_by", "comments", "body");
        });
    });
  });
});
