const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// const routes....
const apiRouter = require("./routes/apiRouter");
const { handle400, handle404 } = require("./errors");

const mongoose = require("mongoose");
const { DB_URL } = require("./config/config");

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use("/api", apiRouter);

//error handling
app.get("/*", (req, res, next) => {
  next({ status: 404, message: "page not found" });
});

app.use(handle404);

app.use(handle400);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
