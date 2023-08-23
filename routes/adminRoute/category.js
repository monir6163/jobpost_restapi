const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/adminController/category.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");

router.get(
    "/category",
    checkAuthMiddleware.checkAuth,
    CategoryController.CategoryView
);

router.post(
    "/createCategory",
    checkAuthMiddleware.checkAuth,
    CategoryController.addCategory
);

router.get(
    "/category/edit/:id",
    checkAuthMiddleware.checkAuth,
    CategoryController.editCategory
);

router.put(
    "/category/update/:id",
    checkAuthMiddleware.checkAuth,
    CategoryController.updateCategory
);

router.delete(
    "/category/delete/:id",
    checkAuthMiddleware.checkAuth,
    CategoryController.deleteCategory
);

//data table and mobile api
router.get("/category/getAllCategories", CategoryController.getAllCategories);

module.exports = router;
