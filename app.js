const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ************ Post ************

const postsRoutes = require("./routes/post");
app.use("/post", postsRoutes);

// ************ endPost ************

// ************ Category ************

// ************ endCategory ************

// ************ User ************

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

// ************ endUser ************

// ************ Comment ************

// ************ endComment ************

module.exports = app;
