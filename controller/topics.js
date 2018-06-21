const { Topic, Article, User, Comment } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

const getAllArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find()
    .where("belongs_to")
    .equals(topic_slug)
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

const addArticleByTopic = (req, res, next) => {
    const newArticle = new Article(req.body)
    newArticle.belongs_to = req.params.topic_slug
    newArticle.save()
    .then((newArticle) => {
        console.log(newArticle)
        res.status(201).send({newArticle})
    })
    .catch(next)
};

module.exports = { getAllTopics, getAllArticlesByTopic, addArticleByTopic };
