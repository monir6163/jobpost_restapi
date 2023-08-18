const jwt = require("jsonwebtoken");
const models = require("../models");

function checkAuth(req, res, next) {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // const token = req.cookies.jwt;
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        // req.userData = decoded;
        const token = req.cookies.jwt;
        //check if token exists in the cookie and if it does not exist, then the user is not authenticated
        if (token) {
            //verify the token
            jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    // console.log(decoded);
                    next();
                }
            });
        } else {
            res.redirect("/");
        }
        next();
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

function checkUser(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (token) {
            //verify the token
            jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.locals.user = null;
                    next();
                } else {
                    // console.log(decoded);
                    let user = await models.User.findByPk(decoded.userId);
                    // console.log(user.name);
                    res.locals.user = user;
                    next();
                }
            });
        } else {
            res.locals.user = null;
            next();
        }
    } catch (error) {
        console.log(error);
        res.locals.user = null;
        next();
    }
}

function loggedInUserRedirect(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        // User is already logged in, redirect them to another page
        return res.redirect("/dashboard"); // Change this URL to your desired page
    } else {
        // User is not logged in, proceed to the next middleware
        next();
    }
}

module.exports = {
    checkAuth: checkAuth,
    checkUser: checkUser,
    loggedInUserRedirect: loggedInUserRedirect,
};
