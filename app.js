const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// const routes....

//all seed stuffs
//start mongo connection

app.use(bodyParser.JSON())




app.use("/*", (req, res, next) => {
    res.send({status: 404, message: 'page not found'})
})

app.use((err, req, res, next) => {
    if (err.status) res.send({status: err.status, message: err.message})
    else res.send({status: 500, message: 'Internal server error'})
})


module.exports = app