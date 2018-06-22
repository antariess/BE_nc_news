const {User} = require("../models")

const getUserByID = (req, res, next) => {
  const {username} = req.params
  User.find({username: username})
  .then(userDoc => {
    user = userDoc[0]
    res.send({user})
  })
  .catch(next)
}

module.exports = {getUserByID}