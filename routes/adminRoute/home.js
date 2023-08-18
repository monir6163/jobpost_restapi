const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/home.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");
router.get(
    "/dashboard",
    checkAuthMiddleware.checkAuth,
    homeController.indexView
);
router.get(
    "/category",
    checkAuthMiddleware.checkAuth,
    homeController.CategoryView
);
module.exports = router;
