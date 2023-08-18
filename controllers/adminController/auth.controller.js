const models = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("fastest-validator");

//render the login page
module.exports.login = (req, res) => {
    res.render("login", {
        layout: "login-layout",
        title: "Admin Login Page",
    });
};

//login the user and create a token for the user to use for authentication for 24 hours and store the token in a cookie in the browser for 24 hours as well
module.exports.loginUser = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    console.log(req.body);

    const schema = {
        email: { type: "email", optional: false },
        password: { type: "string", optional: false },
    };

    const v = new validator();
    const validationResponse = v.validate(user, schema);

    if (validationResponse !== true) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: validationResponse,
        });
    }

    models.User.findOne({ where: { email: user.email } })
        .then((result) => {
            if (result) {
                const isPasswordValid = bcrypt.compareSync(
                    user.password,
                    result.password
                );
                if (isPasswordValid) {
                    const token = jwt.sign(
                        {
                            userId: result.id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "24h",
                        }
                    );

                    res.cookie("jwt", token, {
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true,
                    });

                    return res.status(200).json({
                        status: "success",
                        message: "User logged in successfully",
                        token: token,
                        user: result,
                    });
                } else {
                    return res.status(404).json({
                        status: "error",
                        message: "Invalid login details",
                    });
                }
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
            }
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error: error,
            });
        });
};

//logout the user and clear the cookie
module.exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.redirect("/");
};
