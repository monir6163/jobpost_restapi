const express = require("express");
const router = express.Router();
const checkAuthMiddleware = require("../../middleware/checkAuth");
const noticeController = require("../../controllers/adminController/notice.controller");
const multer = require("multer");
const path = require("path");

//multer

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

// ************ admin/notice ************

router.get(
    "/notice",
    checkAuthMiddleware.checkAuth,
    noticeController.viewAllNotice
);

router.get(
    "/notice/from",
    checkAuthMiddleware.checkAuth,
    noticeController.addViewForm
);
router.post(
    "/notice/create",
    upload.array("image", 5),
    checkAuthMiddleware.checkAuth,
    noticeController.addNotice
);

router.get(
    "/notice/edit/:id",
    checkAuthMiddleware.checkAuth,
    noticeController.noticeeditview
);

router.put(
    "/notice/update/:id",
    upload.array("image", 5),
    checkAuthMiddleware.checkAuth,
    noticeController.noticeUpdate
);

router.delete(
    "/notice/delete/:id",
    checkAuthMiddleware.checkAuth,
    noticeController.deleteNotice
);

//react native api for notice get all notice category wise
router.get("/getallNotice/:id", noticeController.getAllNotice);
router.get("/noticeDetails/:id", noticeController.getOneNotice);

module.exports = router;
