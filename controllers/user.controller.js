const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("fastest-validator");

function signup(req, res) {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    };

    const schema = {
        name: { type: "string", optional: false, max: "100" },
        email: { type: "email", optional: false, max: "100" },
        password: { type: "string", optional: false, max: "100" },
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

    // Check if email exists
    models.User.findOne({ where: { email: user.email } })
        .then((result) => {
            if (result) {
                res.status(409).json({
                    status: "error",
                    message: "Email already exists",
                });
            } else {
                models.User.create(user)
                    .then((result) => {
                        res.status(201).json({
                            status: "success",
                            message: "User signed up successfully",
                            user: result,
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            status: "error",
                            message: "Something went wrong",
                            error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error: error,
            });
        });
}

function login(req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

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
                            email: result.email,
                            userId: result.id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );

                    res.status(200).json({
                        status: "success",
                        message: "Login successful",
                        token: token,
                    });
                } else {
                    res.status(401).json({
                        status: "error",
                        message: "Authentication failed",
                    });
                }
            } else {
                res.status(401).json({
                    status: "error",
                    message: "Authentication failed",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error: error,
            });
        });
}

module.exports = {
    signup: signup,
    login: login,
};
