const usersRouter = require('express').Router()
const {getUserByID} = require("../controller/users")

usersRouter.route('/:username')
.get(getUserByID)

module.exports = usersRouter