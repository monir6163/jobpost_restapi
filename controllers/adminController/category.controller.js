const models = require("../../models");
const CategoryView = async (req, res) => {
    // get all categories from database descending order
    const categories = await models.Category.findAll({
        order: [["id", "DESC"]],
    });
    res.render("pages/category/category", { title: "Category", categories });
};

//api for get all categories from database descending order for admin panel and mobile app
const getAllCategories = async (req, res) => {
    try {
        const categories = await models.Category.findAll({
            order: [["id", "DESC"]],
        });
        if (categories) {
            return res.status(200).json({
                status: "success",
                categories: categories,
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
    try {
        const { catName } = req.body;
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
