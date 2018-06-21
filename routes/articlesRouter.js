const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleByID,
  articleUpDownVote,
  getCommentsByArticle,
  addCommentByArticle
} = require("../controller/articles");

articlesRouter.route("/")
  .get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .put(articleUpDownVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addCommentByArticle);

module.exports = articlesRouter;
