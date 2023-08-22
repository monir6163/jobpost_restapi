const express = require("express");
const router = express.Router();
const SubCategoryController = require("../../controllers/adminController/subcategory.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");

router.get(
    "/subCategory",
    checkAuthMiddleware.checkAuth,
    SubCategoryController.SubCategoryView
);

router.get(
    "/addSubCategory",
    checkAuthMiddleware.checkAuth,
    SubCategoryController.addSubCategoryView
);

router.post(
    "/createSubCategory",
    checkAuthMiddleware.checkAuth,
    SubCategoryController.addSubCategory
);

module.exports = router;
