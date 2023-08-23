const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/adminController/posts.controller");
const checkAuthMiddleware = require("../../middleware/checkAuth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/images";
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
    "/postview",
    checkAuthMiddleware.checkAuth,
    postsController.viewAllPost
);
router.get(
    "/addpost",
    checkAuthMiddleware.checkAuth,
    postsController.addViewForm
);
router.post(
    "/post",
    upload.array("image", 5),
    checkAuthMiddleware.checkAuth,
    postsController.save
);
router.get("/", checkAuthMiddleware.checkAuth, postsController.getAll);
router.get("/:id", checkAuthMiddleware.checkAuth, postsController.getOne);
router.put("/:id", checkAuthMiddleware.checkAuth, postsController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, postsController.remove);
module.exports = router;
