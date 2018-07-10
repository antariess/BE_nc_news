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

const articleUpDownVote = (req, res, next) => {
  const {article_id} = req.params
  let countUpOrDown = req.query.vote
    const increment = (countUpOrDown === 'up') 
      ? {$inc: {votes: 1}} 
      : countUpOrDown === 'down' 
      ? {$inc: {votes: -1}}
      : null
    if (increment === null) throw next({status: 400, message: `Bad request: can only 'up' or 'down' vote`, name:"ValidationError"})
    Article.findByIdAndUpdate(article_id, increment, {new: true})
    .populate("created_by")
    .lean()
    .then(updated => {
      const username = updated.created_by
      const article = {...updated, created_by: username}
      res.status(200).send({article})
    })
    .catch(next)
    
};

const getCommentsByArticle = (req, res, next) => {
  const {article_id} = req.params
  Comment.find()
  .where("belongs_to")
  .equals(article_id)
  .populate("created_by")
  .lean()
  .then((commentDocs) => {
    const comments = commentDocs.map(commentDoc => {
      const created_by = commentDoc.created_by
      return {
        ...commentDoc,
        created_by: created_by.username
      }
    })
    res.send({comments})
  })
  .catch(next)
};

const addCommentByArticle = (req, res, next) => {
  const newComment = new Comment(req.body)
  newComment.save()
  .then((comment) => {
    res.status(201).send({comment})
  })
  .catch(err => {
    next(err)
  })
};


module.exports = { getAllArticles, getArticleByID, articleUpDownVote, getCommentsByArticle, addCommentByArticle };
