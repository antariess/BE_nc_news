const { User } = require("../models");

const getUserByID = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(userDoc => {
      if (userDoc.length === 0) {
        next({status: 404, message: `Page not found: the user you are looking for does not exist`})
      }
      else {
        const user = userDoc[0]
        res.send({user})
      }
    })
    .catch(next);
};

module.exports = { getUserByID };
