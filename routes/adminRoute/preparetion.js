const express = require("express");
const router = express.Router();
const checkAuthMiddleware = require("../../middleware/checkAuth");
const preparetionController = require("../../controllers/adminController/preparetion.controller");
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
// ************ admin/preparetion ************

router.get(
    "/preparetion",
    checkAuthMiddleware.checkAuth,
    preparetionController.viewAllPreparetion
);

router.get(
    "/addPreparetionform",
    checkAuthMiddleware.checkAuth,
    preparetionController.addPreparetionform
);

router.post(
    "/addPreparetion",
    upload.array("image", 5),
    checkAuthMiddleware.checkAuth,
    preparetionController.addPreparetion
);

router.get(
    "/preparetion/edit/:id",
    checkAuthMiddleware.checkAuth,
    preparetionController.preparetioneditview
);

router.put(
    "/preparetion/update/:id",
    upload.array("image", 5),
    checkAuthMiddleware.checkAuth,
    preparetionController.preparetionUpdate
);

router.delete(
    "/preparetion/delete/:id",
    checkAuthMiddleware.checkAuth,
    preparetionController.deletePreparetion
);

// ************ react native api ************
router.get("/getallPreparetion/:id", preparetionController.getAllPreparetion);
router.get("/preparetionDetails/:id", preparetionController.getOnePreparetion);

module.exports = router;
