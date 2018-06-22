const commentsRouter = require('express').Router()
const {upOrDownVoteComment, removeComment} = require('../controller/comments')

commentsRouter.route("/:comment_id")
.put(upOrDownVoteComment)
.delete(removeComment)

module.exports = commentsRouter