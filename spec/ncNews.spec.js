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
    //get article by ID
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
    it("GET with incorrect id to return 400", () => {
      return request
      .get(`/api/articles/blep123`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal("Bad request: blep123 is not a valid ID")
      })
    })
    it("GET with correct id format but not existing", () => {
      return request
      .get(`/qpi/articles${userDocs[0]._id}`)
      .expect(404)
      .then(res => {
        expect(res.body.message).to.equal(`Page not found`)
      })
    })
    //upvote downvote articles
    it("PUT increment vote count", () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          const {article} = res.body;
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
          expect(article.votes).to.equal(1)
          expect(article).to.include.keys("created_by", "votes", "body");
        });
    });
    it("PUT decrement vote count", () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          const {article} = res.body;
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
          expect(article.votes).to.equal(-1)
          expect(article).to.include.keys("created_by", "votes", "body");
        });
    });
    it('PUT when provided with incorrect query param', () => {
      return request
      .put(`/api/comments/${articleDocs[0]._id}?vote=blep123`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal(`Bad request: can only 'up' or 'down' vote`)
      })
    })
  });
  //get all comments byt article id ---> errors already tested above
  describe("/api/articles/:article_id/comments", () => {
    it("GET article by ID", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          const comments = res.body.comments;
          expect(comments.length).to.equal(2)
          expect(comments[0].belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(comments[0]).to.include.keys("created_by", "belongs_to", "votes", "created_at", "body");
        });
    });
  });
  //add a comment by article
  describe("/api/articles/:article_id/comments", () => {
    it("POST adds an article", () => {
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(201)
        .send({
          body: "commenting on stuffs", 
          belongs_to: articleDocs[0]._id, 
          created_by: userDocs[0]._id
        })
        .then(res => {
          const {comment} = res.body;
          expect(comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(comment).to.include.keys("created_by", "belongs_to", "votes", "created_at", "body");
        });
    });
    it("POST with compulsory fields missing", () => {
      return request
      .post(`/api/articles/${articleDocs[0]._id}/comments`)
      .expect(400)
      .send({})
      .then(res => {
        expect(res.body.message).to.equal(`Bad request: comments validation failed: created_by: Path \`created_by\` is required., belongs_to: Path \`belongs_to\` is required., body: Path \`body\` is required.`)
      })
    })    
  });  
  //comments
  describe("/api/comments/:comment_id", () => {
    //up and down voting
    it('PUT upvote a comment by ID', () => {
      return request
      .put(`/api/comments/${commentsDocs[0]._id}?vote=up`)
      .expect(200)
      .then(res => {
        const {comment} = res.body
        expect(comment._id).to.equal(`${commentsDocs[0]._id}`)
        expect(comment.votes).to.equal(commentsDocs[0].votes + 1)
        expect(comment).to.include.keys("created_by", "belongs_to", "votes")
      })
    })
    it('PUT down a comment by ID', () => {
      return request
      .put(`/api/comments/${commentsDocs[0]._id}?vote=down`)
      .expect(200)
      .then(res => {
        const {comment} = res.body
        expect(comment._id).to.equal(`${commentsDocs[0]._id}`)
        expect(comment.votes).to.equal(commentsDocs[0].votes - 1)
        expect(comment).to.include.keys("created_by", "belongs_to", "votes")
      })
    })
    it('PUT when provided with incorrect query param', () => {
      return request
      .put(`/api/comments/${commentsDocs[0]._id}?vote=blep123`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal(`Bad request: can only 'up' or 'down' vote`)
      })
    })
    //deleting comments
    it('DELETE a comment by ID', () => {
      return request
      .delete(`/api/comments/${commentsDocs[0]._id}`)
      .expect(204)
      .then(res => {
        expect(res.body).to.be.empty
      })
    })
    it("DELETE cannot delete if invalid id", () => {
      return request
      .delete(`/api/comments/blep123`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal(`Bad request: blep123 is not a valid ID`)
      })
    })
  })
  //users
  describe("/api/users/:username", () => {
    it("GET a user by username", () => {
      return request 
      .get(`/api/users/${userDocs[0].username}`)
      .expect(200)
      .then(res => {
        const {user} = res.body
        expect(user).to.include.keys("username", "name", "avatar_url")
        expect(user.usename).to.equal(userDocs[0].usename)
      })
    })
    it("GET 404 when user not found ", () => {
      return request
      .get(`/api/users/:blep123`)
      .expect(404)
      .then(res => {
        expect(res.body.message).to.equal(`Page not found: the user you are looking for does not exist`)
      })
    })
  })
});
 