const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getAllArticlesByTopic,
  addArticleByTopic
} = require("../controller/topics.js");

topicsRouter.route("/")
  .get(getAllTopics);

topicsRouter.route("/:topic_slug/articles")
  .get(getAllArticlesByTopic)
  .post(addArticleByTopic)

module.exports = topicsRouter;
