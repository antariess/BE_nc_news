const {Comment} = require('../models')

const upOrDownVoteComment = (req, res, next) => {
  const upOrDown = req.query.vote
  const {comment_id} = req.params
  const increment = (upOrDown === 'up') ? {$inc: {votes: 1}} : {$inc: {votes: -1}} 
  Comment.findByIdAndUpdate(comment_id, increment, {new: true})
  .populate("created_by")
  .populate("belongs_to")
  .lean()
  .then(updatedComment => {
    const {username} = updatedComment.created_by
    const {title} = updatedComment.belongs_to
    const comment = {...updatedComment, created_by: username, belongs_to: title}
    res.status(200).send({comment})
  })
  .catch(next)
}

const removeComment = (req, res, next) => {
 const {comment_id} = req.params
 Comment.findByIdAndRemove(comment_id)
 .then(() => {
   res.status(204).send({})
 })
 .catch(next)
}

module.exports = ({upOrDownVoteComment, removeComment})