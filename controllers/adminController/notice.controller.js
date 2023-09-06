const models = require("../../models");
const fs = require("fs");
const path = require("path");

const viewAllNotice = async (req, res) => {
    //get all posts from database descending with category and user
    const notices = await models.Notice.findAll({
        order: [["id", "DESC"]],
    });
    res.render("pages/notice/notice", {
        title: "View All Notice",
        notices: notices,
    });
};

const addViewForm = async (req, res) => {
    res.render("pages/notice/addNotice", {
        title: "Add Notice",
    });
};

const addNotice = async (req, res) => {
    const imageUrls = req.files?.map((file) =>
        file?.path.replace("public", "")
    );
    const { title, source, content, category } = req.body;

    if (!title || !category) {
        return res.status(400).json({
            message: "Title and category are required",
            status: "error",
        });
    }

    try {
        await models.Notice.create({
            title,
            source,
            content,
            catId: category,
            image: imageUrls.join(","),
        });

        res.status(201).json({
            message: "Notice created successfully",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

const noticeeditview = async (req, res) => {
    const id = req.params.id;
    const notice = await models.Notice.findByPk(id);
    res.render("pages/notice/editNotice", {
        title: "Edit Notice",
        notice: notice,
    });
};

const noticeUpdate = async (req, res) => {
    let noticeId = req.params.id;
    const { title, source, content, category } = req.body;
    let imageUrls = req.files?.map((file) => file?.path.replace("public", ""));

    if (!title || !category) {
        return res.status(400).json({
            message: "Title and category are required",
            status: "error",
        });
    }
    try {
        // Get the notice from the database by ID
        const notice = await models.Notice.findOne({
            where: {
                id: noticeId,
            },
        });
        if (imageUrls.length === 0) {
            // Use the existing images if imageUrls is empty
            imageUrls = notice.image.split(",");
        } else {
            // Delete the old images
            let images = notice.image.split(",");
            images.forEach((image) => {
                let imagePath = path.join(__dirname, "../../public", image);
                imagePath = imagePath.replace(/\\/g, "/");
                // Delete the image from the folder if it exists in the uploads folder and is not the default image
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    res.status(404).json({
                        message: "Image not found",
                        status: "error",
                    });
                }
            });
        }

        // Update the notice
        await models.Notice.update(
            {
                title,
                source,
                content,
                catId: category,
                image: imageUrls.join(","),
            },
            {
                where: {
                    id: noticeId,
                },
            }
        );
        res.status(200).json({
            message: "Notice updated successfully",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

const deleteNotice = async (req, res) => {
    let noticeId = req.params.id;
    try {
        const notice = await models.Notice.findOne({
            where: {
                id: noticeId,
            },
        });
        // Delete post images from the folder
        const images = notice.image.split(",");
        images.forEach((image) => {
            let imagePath = path.join(__dirname, "../../public", image);
            imagePath = imagePath.replace(/\\/g, "/");
            // Delete the image from the folder if it exists in the uploads folder and is not the default image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                return res.status(404).json({
                    message: "Image not found",
                    status: "error",
                });
            }
        });

        await models.Notice.destroy({
            where: {
                id: noticeId,
            },
        }).then(() => {
            res.status(200).json({
                message: "Notice deleted successfully",
                status: "success",
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

//react native api for notice get all notice category wise
const getAllNotice = async (req, res) => {
    const catId = req.params.id;
    const notices = await models.Notice.findAll({
        order: [["id", "DESC"]],
        where: {
            catId: catId,
        },
    });

    const allNotice = notices.map((notice) => {
        let images = notice.image.split(",");
        images = images?.map((image) => {
            return image.replace(/\\/g, "/");
        });
        return {
            id: notice.id,
            title: notice.title,
            source: notice.source,
            content: notice.content,
            image: images?.map((image) => {
                return `${process.env.APP_URL}${image}`;
            }),
            catId: notice.catId,
            createdAt: notice.createdAt,
            updatedAt: notice.updatedAt,
        };
    });

    res.status(200).json({
        status: "success",
        notices: allNotice,
    });
};

//react native api for notice get one notice by id
const getOneNotice = async (req, res) => {
    const id = req.params.id;
    try {
        const notice = await models.Notice.findByPk(id);
        if (!notice) {
            return res.status(404).json({
                message: "Notice not found",
                status: "error",
            });
        }
        let images = notice?.image.split(",");
        images = images?.map((image) => {
            return image.replace(/\\/g, "/");
        });
        notice.viewCount += 1;
        await notice.update(
            {
                viewCount: notice.viewCount,
            },
            {
                fields: ["viewCount"],
                silent: true,
            }
        );
        res.status(200).json({
            status: "success",
            notice: {
                id: notice.id,
                title: notice.title,
                source: notice.source,
                content: notice.content,
                image: images?.map((image) => {
                    return `${process.env.APP_URL}${image}`;
                }),
                catId: notice.catId,
                viewCount: notice.viewCount,
                createdAt: notice.createdAt,
                updatedAt: notice.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

module.exports = {
    viewAllNotice: viewAllNotice,
    addViewForm: addViewForm,
    addNotice: addNotice,
    noticeeditview: noticeeditview,
    noticeUpdate: noticeUpdate,
    deleteNotice: deleteNotice,
    getAllNotice: getAllNotice,
    getOneNotice: getOneNotice,
};
