const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/adminController/category.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/catimage";
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toLocaleLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();
        cb(null, fileName + fileExt);
    },
});

const upload = multer({
    storage: storage,
    // need 20 MB
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb("Error: Images Only!");
        }
    },
});

router.get(
    "/category",
    checkAuthMiddleware.checkAuth,
    CategoryController.CategoryView
);

router.post(
    "/createCategory",
    upload.single("catimag"),
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
    upload.single("catimag"),
    checkAuthMiddleware.checkAuth,
    CategoryController.updateCategory
);

router.delete(
    "/category/delete/:id",
    checkAuthMiddleware.checkAuth,
    CategoryController.deleteCategory
);

//for api react native
router.get("/category/getAllCategories", CategoryController.getAllCategories);

module.exports = router;
