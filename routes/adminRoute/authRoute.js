const express = require("express");
const router = express.Router();
const authController = require("../../controllers/adminController/auth.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");
router.get("/", checkAuthMiddleware.loggedInUserRedirect, authController.login);
router.post("/loginUser", authController.loginUser);
router.get("/logout", authController.logout);

module.exports = router;
