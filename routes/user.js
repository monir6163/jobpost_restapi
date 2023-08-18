const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const checkAuthMiddleware = require("../middleware/checkAuth");
router.post("/signup", userController.signup);
router.post("/login", userController.login);
module.exports = router;
