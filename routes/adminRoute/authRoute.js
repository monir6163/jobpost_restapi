const express = require("express");
const router = express.Router();
const authController = require("../../controllers/adminController/auth.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");
const userController = require("../../controllers/user.controller");
router.get("/", checkAuthMiddleware.loggedInUserRedirect, authController.login);
router.post("/loginUser", authController.loginUser);
router.get("/logout", authController.logout);

//only for registered users
// router.post("/signup", userController.signup);

module.exports = router;
