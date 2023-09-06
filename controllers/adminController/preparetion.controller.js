const models = require("../../models");
const fs = require("fs");
const path = require("path");

const viewAllPreparetion = async (req, res) => {
    const preparetions = await models.Preparetion.findAll({
        order: [["id", "DESC"]],
    });

    res.render("pages/preparetion/preparetion", {
        title: "View All Preparetion",
        preparetions: preparetions,
    });
};

const addPreparetionform = async (req, res) => {
    res.render("pages/preparetion/addPreparetion", {
        title: "Add Preparetion",
    });
};

const addPreparetion = async (req, res) => {
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
        await models.Preparetion.create({
            title,
            source,
            content,
            catId: category,
            image: imageUrls.join(","),
        });

        res.status(201).json({
            message: "Book created successfully",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

const preparetioneditview = async (req, res) => {
    const id = req.params.id;
    const preparetion = await models.Preparetion.findByPk(id);
    res.render("pages/preparetion/editPreparetion", {
        title: "Edit Preparetion",
        preparetion: preparetion,
    });
};

const preparetionUpdate = async (req, res) => {
    let preparetionId = req.params.id;
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
        const preparetion = await models.Preparetion.findOne({
            where: {
                id: preparetionId,
            },
        });
        if (imageUrls.length === 0) {
            // Use the existing images if imageUrls is empty
            imageUrls = preparetion.image.split(",");
        } else {
            // Delete the old images
            let images = preparetion.image.split(",");
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
        await models.Preparetion.update(
            {
                title,
                source,
                content,
                catId: category,
                image: imageUrls.join(","),
            },
            {
                where: {
                    id: preparetionId,
                },
            }
        );
        res.status(200).json({
            message: "Preparetion updated successfully",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};

const deletePreparetion = async (req, res) => {
    let preparetionId = req.params.id;
    try {
        const preparetion = await models.Preparetion.findOne({
            where: {
                id: preparetionId,
            },
        });
        // Delete post images from the folder
        const images = preparetion.image.split(",");
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

        await models.Preparetion.destroy({
            where: {
                id: preparetionId,
            },
        }).then(() => {
            res.status(200).json({
                message: "Book Page deleted successfully",
                status: "success",
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
};
//react native api for notice get all notice category wise
const getAllPreparetion = async (req, res) => {
    const catId = req.params.id;
    const preparetions = await models.Preparetion.findAll({
        order: [["id", "DESC"]],
        where: {
            catId: catId,
        },
    });

    const allPreparetion = preparetions?.map((preparetion) => {
        let images = preparetion.image.split(",");
        images = images?.map((image) => {
            return image.replace(/\\/g, "/");
        });
        return {
            id: preparetion.id,
            title: preparetion.title,
            source: preparetion.source,
            content: preparetion.content,
            image: images?.map((image) => {
                return `${process.env.APP_URL}${image}`;
            }),
            catId: preparetion.catId,
            createdAt: preparetion.createdAt,
            updatedAt: preparetion.updatedAt,
        };
    });

    res.status(200).json({
        status: "success",
        preparetions: allPreparetion,
    });
};

//react native api for notice get one notice by id
const getOnePreparetion = async (req, res) => {
    const id = req.params.id;
    try {
        const preparetion = await models.Preparetion.findByPk(id);
        if (!preparetion) {
            return res.status(404).json({
                message: "Book not found",
                status: "error",
            });
        }
        let images = preparetion?.image.split(",");
        images = images?.map((image) => {
            return image.replace(/\\/g, "/");
        });
        preparetion.viewCount += 1;
        await preparetion.update(
            {
                viewCount: preparetion.viewCount,
            },
            {
                fields: ["viewCount"],
                silent: true,
            }
        );
        res.status(200).json({
            status: "success",
            notice: {
                id: preparetion.id,
                title: preparetion.title,
                source: preparetion.source,
                content: preparetion.content,
                image: images?.map((image) => {
                    return `${process.env.APP_URL}${image}`;
                }),
                catId: preparetion.catId,
                viewCount: preparetion.viewCount,
                createdAt: preparetion.createdAt,
                updatedAt: preparetion.updatedAt,
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
    viewAllPreparetion: viewAllPreparetion,
    addPreparetionform: addPreparetionform,
    addPreparetion: addPreparetion,
    preparetioneditview: preparetioneditview,
    preparetionUpdate: preparetionUpdate,
    deletePreparetion: deletePreparetion,

    getAllPreparetion: getAllPreparetion,
    getOnePreparetion: getOnePreparetion,
};
