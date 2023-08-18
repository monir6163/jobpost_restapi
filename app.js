const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path").join(__dirname, "public");

const app = express();
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static(path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// ************ every page ************
const { checkUser } = require("./middleware/checkAuth");
app.use(checkUser);

// ************ login ************
const loginRoutes = require("./routes/adminRoute/authRoute");
app.use(loginRoutes);

// ************ Home ************
const homeRoutes = require("./routes/adminRoute/home");

app.use(homeRoutes);

module.exports = app;
