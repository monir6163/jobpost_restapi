const models = require("../models");
function save(req, res) {
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: 1,
    };

    models.Post.create(post)
        .then((result) => {
            res.status(201).json({
                message: "Post created successfully",
                post: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function getAll(req, res) {
    models.Post.findAll()
        .then((result) => {
            res.status(200).json({
                status: "success",
                posts: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function getOne(req, res) {
    const id = req.params.id;
    models.Post.findByPk(id)
        .then((result) => {
            res.status(200).json({
                status: "success",
                post: result,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function update(req, res) {
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
    };
    models.Post.update(updatedPost, { where: { id: id } })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "Post updated successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

function remove(req, res) {
    const id = req.params.id;
    models.Post.destroy({ where: { id: id } })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "Post deleted successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

module.exports = {
    save,
    getAll,
    getOne,
    update,
    remove,
};
