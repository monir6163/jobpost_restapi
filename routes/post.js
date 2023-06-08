const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
router.post("/", postsController.save);
module.exports = router;
