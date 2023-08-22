const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/adminController/category.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");

router.get(
    "/category",
    checkAuthMiddleware.checkAuth,
    CategoryController.CategoryView
);
router.get(
    "/addCategory",
    checkAuthMiddleware.checkAuth,
    CategoryController.addCategoryView
);

router.post(
    "/createCategory",
    checkAuthMiddleware.checkAuth,
    CategoryController.addCategory
);

module.exports = router;
