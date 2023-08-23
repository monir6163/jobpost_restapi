const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path").join(__dirname, "public");
const jwt = require("jsonwebtoken");
const { formatDistance, subDays } = require("date-fns");

const app = express();
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static(path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ************ format date ************
app.locals.formatDistance = formatDistance;
app.locals.subDays = subDays;

// ************ refresh token ************
app.post("/refreshToken", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Refresh token invalid or expired" });
        }

        // Issue a new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
        });
        res.json({ accessToken });
    });
});

// ************ every page ************
const { checkUser } = require("./middleware/checkAuth");
app.use(checkUser);

// ************ login ************
const loginRoutes = require("./routes/adminRoute/authRoute");
app.use(loginRoutes);

// ************ Home ************
const homeRoutes = require("./routes/adminRoute/home");

app.use(homeRoutes);

// ************ Category ************
const categoryRoutes = require("./routes/adminRoute/category");
app.use(categoryRoutes);

// ************ Post ************
const postRoutes = require("./routes/adminRoute/post");
app.use(postRoutes);
module.exports = app;
