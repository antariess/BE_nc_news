const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// const routes....
const apiRouter = require('./routes/apiRouter')

const mongoose = require('mongoose')
const {DB_URL} = require('./config')

mongoose.connect(DB_URL)
.then(() => {
    console.log(`connected to ${DB_URL}`)
})

app.use(bodyParser.JSON())

app.use('/api', apiRouter)


app.use("/*", (req, res, next) => {
    res.send({status: 404, message: 'page not found'})
})

app.use((err, req, res, next) => {
    if (err.status) res.send({status: err.status, message: err.message})
    else res.send({status: 500, message: 'Internal server error'})
})


module.exports = app