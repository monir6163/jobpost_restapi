const jwt = require("jsonwebtoken");
const models = require("../models");

function checkAuth(req, res, next) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.redirect("/");
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                console.log("Access token expired");
                // Handle expired access token, e.g., by redirecting to login
                return res.redirect("/");
            } else {
                console.log("Access token invalid");
                // Handle invalid access token, e.g., by redirecting to login
                return res.redirect("/");
            }
        }

        req.userId = decoded.userId;
        next();
    });
}

function checkUser(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            jwt.verify(
                accessToken,
                process.env.JWT_SECRET,
                async (err, decoded) => {
                    if (err) {
                        if (err.name === "TokenExpiredError") {
                            console.log("Access token expired");
                            // Handle expired access token, set res.locals.user to null

                            const refreshToken = req.cookies.refreshToken;

                            if (!refreshToken) {
                                res.locals.user = null;
                                return next();
                            }

                            jwt.verify(
                                refreshToken,
                                process.env.JWT_SECRET,
                                (err, decodedRefresh) => {
                                    if (err) {
                                        res.locals.user = null;
                                        res.clearCookie("accessToken");
                                        return next();
                                    }

                                    // Issue a new access token
                                    const newAccessToken = jwt.sign(
                                        { userId: decodedRefresh.userId },
                                        process.env.JWT_SECRET,
                                        {
                                            expiresIn: "15m",
                                        }
                                    );

                                    res.cookie("accessToken", newAccessToken, {
                                        httpOnly: true,
                                    });

                                    // Fetch the user and set it to res.locals.user
                                    models.User.findByPk(decodedRefresh.userId)
                                        .then((user) => {
                                            res.locals.user = user;
                                            next();
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            res.locals.user = null;
                                            next();
                                        });
                                }
                            );
                        } else {
                            console.log("Access token invalid");
                            // Handle invalid access token, set res.locals.user to null
                            res.locals.user = null;
                            next();
                        }
                    } else {
                        if (decoded && decoded.userId) {
                            let user = await models.User.findByPk(
                                decoded.userId
                            );
                            res.locals.user = user;
                        } else {
                            res.locals.user = null;
                        }
                        next();
                    }
                }
            );
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
    const token = req.cookies.accessToken;

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
