const mongoose = require('mongoose')
const {Article, Comment, Topic, User} = require('../models')
const { formatArticleData, createUserLookup, formatCommentData, createArticleLookup } = require('../utils')

const seedDB = ({userData, topicData, articleData, commentData}) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            User.insertMany(userData),
            Topic.insertMany(topicData)
        ])
    })   
    .then(([userDocs, topicDocs]) => {
        const userLookup = createUserLookup(articleData, userDocs)
        return Promise.all([
            userDocs,
            Article.insertMany(formatArticleData(articleData, userLookup)),
            topicDocs
        ])
    })
    .then(([userDocs, articleDocs, topicDocs]) => {
        const userLookup = createUserLookup(commentData, userDocs)
        const articleLookup = createArticleLookup(commentData, articleDocs)
        return Promise.all([
            Comment.insertMany(formatCommentData(commentData, userLookup, articleLookup)),
            userDocs,
            articleDocs,
            topicDocs
        ])
    })
    .catch(console.log)
}


module.exports = seedDB