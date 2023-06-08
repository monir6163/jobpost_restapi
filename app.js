const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const postsRoutes = require("./routes/post");

app.use("/post", postsRoutes);

module.exports = app;
