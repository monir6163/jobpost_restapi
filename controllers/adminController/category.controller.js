const models = require("../../models");
const fs = require("fs");
const path = require("path");
const CategoryView = async (req, res) => {
    // get all categories from database descending order
    const categories = await models.Category.findAll({});
    res.render("pages/category/category", { title: "Category", categories });
};

//api for get all categories from database descending order for admin panel and mobile app
const getAllCategories = async (req, res) => {
    try {
        const categories = await models.Category.findAll({});
        if (categories) {
            const allcat = categories.map((cat) => {
                return {
                    id: cat.id,
                    name: cat.name,
                    image: process.env.APP_URL + "/" + cat.image,
                };
            });
            return res.status(200).json({
                status: "success",
                categories: allcat,
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred.",
            status: "error",
        });
    }
};

//create a new category
const addCategory = async (req, res) => {
    const imageUrl = req.file?.path.replace(/\\/g, "/").split("public/")[1];
    try {
        const { catName } = req.body;
        //only string allowed for category name
        const regexString = /^[a-zA-Z]+$/;
        const banglaTextRegex = /^[ঀ-৾\s]+$/u;

        if (!catName || !imageUrl) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Can not be empty",
                },
            });
        } else if (
            !regexString.test(catName) &&
            !banglaTextRegex.test(catName)
        ) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be Vaild",
                },
            });
        } else if (catName.length < 3) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be at least 3 characters",
                },
            });
        } else if (catName.length > 20) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be less than 20 characters",
                },
            });
        }
        // check if category already exists
        const categoryExists = await models.Category.findOne({
            where: {
                name: catName,
            },
        });
        if (categoryExists) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Category already exists",
                },
            });
        }
        // create new category
        const category = await models.Category.create({
            name: catName,
            image: imageUrl,
        });
        if (category) {
            return res.status(201).json({
                status: "success",
                message: "Category created successfully",
                data: category,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred.",
            status: "error",
        });
    }
};

// edit category name by id from database
const editCategory = async (req, res) => {
    // get category id from params and response to client category details
    const { id } = req.params;
    try {
        const category = await models.Category.findOne({
            where: {
                id: id,
            },
        });
        if (category) {
            return res.status(200).json({
                status: "success",
                data: category,
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred.",
            status: "error",
        });
    }
};

// update category name by id from database
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { catName } = req.body;
        let imageUrl;
        if (req?.file) {
            imageUrl = req.file.path.replace(/\\/g, "/").split("public/")[1];
        }
        //only string allowed for category name
        const regexString = /^[a-zA-Z]+$/;
        const banglaTextRegex = /^[ঀ-৾\s]+$/u;

        if (!catName) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Can not be empty",
                },
            });
        } else if (
            !regexString.test(catName) &&
            !banglaTextRegex.test(catName)
        ) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be Vaild",
                },
            });
        } else if (catName.length < 3) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be at least 3 characters",
                },
            });
        } else if (catName.length > 20) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be less than 20 characters",
                },
            });
        }
        // delete old image from public folder
        const cat = await models.Category.findOne({
            where: {
                id: id,
            },
        });
        if (imageUrl === undefined) {
            imageUrl = cat?.image;
        }
        let existedImagePath = path.join(__dirname, "../../public", cat?.image);
        existedImagePath = existedImagePath.replace(/\\/g, "/");
        if (fs.existsSync(existedImagePath)) {
            //imageurl != cat?.image tahole delete korbe
            if (imageUrl != cat?.image) {
                fs.unlinkSync(existedImagePath);
            }
        } else {
            res.status(404).json({
                message: "File does not exist",
                status: "error",
            });
        }
        // check if category already exists
        const categoryExists = await models.Category.findOne({
            where: {
                name: catName,
            },
        });

        if (categoryExists) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Category already exists",
                },
            });
        }
        // update category
        const category = await models.Category.update(
            {
                name: catName,
                image: imageUrl,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        if (category) {
            return res.status(200).json({
                status: "success",
                message: "Category updated successfully",
                data: category,
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred.",
            status: "error",
        });
    }
};

// delete category by id from database
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const cat = await models.Category.findOne({
            where: {
                id: id,
            },
        });
        const existedImagePath = path.join(
            __dirname,
            "../../public",
            cat?.image
        );
        if (fs.existsSync(existedImagePath)) {
            fs.unlinkSync(existedImagePath);
        } else {
            res.status(404).json({
                message: "File does not exist",
                status: "error",
            });
        }
        // delete category from database
        const category = await models.Category.destroy({
            where: {
                id: id,
            },
        });
        if (category) {
            return res.status(200).json({
                status: "success",
                message: "Category deleted successfully",
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred.",
            status: "error",
        });
    }
};

module.exports = {
    CategoryView: CategoryView,
    addCategory: addCategory,
    editCategory: editCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    getAllCategories: getAllCategories,
};
