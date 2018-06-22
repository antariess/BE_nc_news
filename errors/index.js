const handle400 = (err, req, res, next) => {
  err.name === "CastError"
    ? res
        .status(400)
        .send({ message: `Bad request: ${err.value} is not a valid ID` })
    : err.name === "ValidationError"
      ? res.status(400).send({ message: `Bad request: ${err.message}` })
      : next(err);
}

const handle404 = (err, req, res, next) => {
  err.status
    ? res.status(err.status).send({ message: err.message })
    : next(err);
}




module.exports = {handle400, handle404}