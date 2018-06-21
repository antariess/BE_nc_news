const {Article, Comment, User} = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find() 
    .populate("created_by")
    .lean()
    .then(articles => {
      const counts = articles.map(article => {
        return Comment.count({ belongs_to: article._id });
      });
      counts.push(articles);
      return Promise.all(counts);
    })
    .then(counts => {
      const rawArticles = counts.pop();
      const articles = rawArticles.map(article => {
        const { created_by } = article;
        const formatedArticle = {
          ...article,
          created_by: created_by.username,
          comments: counts.shift()
        };
        return formatedArticle;
      });
      res.send({ articles });
    })
    .catch(next);
};

const getArticleByID = (req, res, next) => {
  const articleID = req.params.article_id
  Article.findById(articleID)
  .populate("created_by")
  .lean()
  .then(article => {
    return Promise.all([
      article,
      Comment.count({ belongs_to: article._id })
    ])
  })
  .then(([article, count]) => {
    const {created_by} = article
    return {
      ...article,
      created_by: created_by.username,
      comments: count
    }
  })
  .then(articleDoc => {
    res.send({article: articleDoc})
  })  
  .catch(next)
};

const articleUpDownVote = () => {

};

const getCommentsByArticle = () => {

};

const addCommentByArticle = () => {

};


module.exports = { getAllArticles, getArticleByID, articleUpDownVote, getCommentsByArticle, addCommentByArticle };
