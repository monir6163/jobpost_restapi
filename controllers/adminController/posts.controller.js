const models = require("../../models");
const fs = require("fs");
const path = require("path");

//******************** view all post   *********************//

const viewAllPost = async (req, res) => {
    //get all posts from database descending with category and user
    const posts = await models.Post.findAll({
        order: [["id", "DESC"]],
        include: [
            {
                model: models.Category,
                as: "category",
                attributes: ["id", "name"],
            },
            {
                model: models.User,
                as: "user",
                attributes: ["id", "name"],
            },
        ],
    });
    res.render("pages/posts/post", {
        title: "View All Post",
        posts: posts,
    });
};

//category wise post get from database
const categoryWisePost = async (req, res) => {
    const id = req.params.id;
    const posts = await models.Post.findAll({
        where: { categoryId: id },
        order: [["id", "DESC"]],
        include: [
            {
                model: models.Category,
                as: "category",
                attributes: ["id", "name"],
            },
            {
                model: models.User,
                as: "user",
                attributes: ["id", "name"],
            },
        ],
    });
    if (posts) {
        allpost = posts.map((post) => {
            //image url convert to array from string
            let imageUrls = post.imageUrl.split(",");
            return {
                id: post.id,
                title: post.title,
                tags: post.tags,
                address: post.address,
                endDate: post.endDate,
                content: post.content,
                imageUrl: imageUrls?.map((imageUrl) => {
                    return `${process.env.APP_URL + imageUrl}`;
                }),
                ViewCount: post.ViewCount,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                category: {
                    id: post.category.id,
                    name: post.category.name,
                },
                user: {
                    id: post.user.id,
                    name: post.user.name,
                },
            };
        });

        return res.status(200).json({
            status: "success",
            posts: allpost,
        });
    } else {
        return res.status(404).json({
            status: "error",
            message: "Post not found",
        });
    }
};

const addViewForm = async (req, res) => {
    //get all categories from database descending
    const categories = await models.Category.findAll({
        order: [["id", "DESC"]],
    });
    res.render("pages/posts/addpost", {
        title: "Add Post",
        categories: categories,
    });
};

const posteditview = async (req, res) => {
    const id = req.params.id;
    const post = await models.Post.findByPk(id);
    const categories = await models.Category.findAll({
        order: [["id", "DESC"]],
    });
    res.render("pages/posts/editpost", {
        title: "Edit Post",
        post: post,
        categories: categories,
    });
};

function save(req, res) {
    const imageUrls = req.files.map((file) => file?.path.replace("public", ""));
    const post = {
        title: req.body.title,
        tags: req.body.tags,
        address: req.body.address,
        endDate: req.body.endDate,
        content: req.body.content,
        imageUrl: imageUrls.join(","), // convert array to string
        categoryId: +req.body.category,
        userId: res.locals.user.id,
    };

    if (
        post.title == "" ||
        post.tags == "" ||
        post.address == "" ||
        post.endDate == "" ||
        post.content == "" ||
        post.categoryId == "" ||
        post.imageUrl === null
    ) {
        return res.status(400).json({
            message: "Please fill all fields",
            status: "error",
        });
    }

    models.Post.create({
        title: post.title,
        tags: post.tags,
        address: post.address,
        endDate: post.endDate,
        content: post.content,
        imageUrl: post.imageUrl,
        categoryId: post.categoryId,
        userId: post.userId,
    })
        .then((result) => {
            res.status(201).json({
                message: "Post created successfully",
                post: result,
                status: "success",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Something went wrong",
                error: error,
            });
        });
}

async function getOne(req, res) {
    const id = req.params.id;
    //get post by id from database with category and user table data
    const post = await models.Post.findOne({
        where: { id: id },
        include: [
            {
                model: models.Category,
                as: "category",
                attributes: ["id", "name"],
            },
            {
                model: models.User,
                as: "user",
                attributes: ["id", "name"],
            },
        ],
    });
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            status: "error",
        });
    }
    post.ViewCount += 1;
    await post.update(
        { ViewCount: post.ViewCount },
        { fields: ["ViewCount"], silent: true }
    );
    res.status(200).json({
        status: "success",
        post: post,
    });
}

async function update(req, res) {
    const imageUrls = req.files.map((file) => file?.path.replace("public", ""));
    const id = req.params.id;
    const userId = res.locals.user.id;
    const updatedPost = {
        title: req.body.title,
        tags: req.body.tags,
        address: req.body.address,
        endDate: req.body.endDate,
        content: req.body.content,
        imageUrl: imageUrls.join(","), // convert array to string
        categoryId: req.body.category,
    };
    //get image url from database
    const post = await models.Post.findOne({
        where: { id: id, userId: userId },
    });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            status: "error",
        });
    }

    if (updatedPost.imageUrl == "") {
        updatedPost.imageUrl = post.imageUrl;
    }
    // Delete post images from the folder
    const imageUrlsFromDb = post.imageUrl.split(",");
    imageUrlsFromDb.forEach((imageUrl) => {
        // Delete the image from the folder if it exists in the uploads folder and is not the default image

        let imagePath = path.join(__dirname, "../../public", imageUrl);
        imagePath.replace("public", "");
        if (fs.existsSync(imagePath)) {
            //updatepost.imageurl != post.imageurl tahole delete korbe
            if (updatedPost.imageUrl != post.imageUrl) {
                fs.unlinkSync(imagePath);
            }
        } else {
            res.status(404).json({
                message: "File does not exist",
                status: "error",
            });
        }
    });

    models.Post.update(updatedPost, {
        where: { id: id, userId: userId },
    })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "Post updated successfully",
                post: updatedPost,
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
    const userId = res.locals.user.id;
    // Retrieve the post before deleting to get image URLs
    models.Post.findOne({ where: { id: id, userId: userId } })
        .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "Post not found",
                });
            }

            // Delete post images from the folder
            const imageUrls = post.imageUrl.split(",");
            imageUrls.forEach((imageUrl) => {
                let imagePath = path.join(__dirname, "../../public", imageUrl);
                imagePath.replace("public", "");
                // Delete the image from the folder if it exists in the uploads folder and is not the default image
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    res.status(404).json({
                        message: "File does not exist",
                        status: "error",
                    });
                }
            });
            // Now delete the post from the database
            models.Post.destroy({ where: { id: id, userId: userId } })
                .then((result) => {
                    res.status(200).json({
                        status: "success",
                        message: "Post and images deleted successfully",
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        message: "Something went wrong",
                        error: error,
                    });
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
    save: save,
    getOne: getOne,
    update: update,
    remove: remove,

    viewAllPost: viewAllPost,
    addViewForm: addViewForm,
    posteditview: posteditview,
    categoryWisePost: categoryWisePost,
};
