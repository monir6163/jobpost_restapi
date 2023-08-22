const models = require("../../models");
const CategoryView = async (req, res) => {
    // get all categories from database descending order
    const categories = await models.Category.findAll({
        order: [["id", "DESC"]],
    });
    res.render("pages/category", { title: "Category", categories });
};

const addCategoryView = (req, res) => {
    res.render("pages/addCategory", { title: "Add Category" });
};

//create a new category
const addCategory = async (req, res) => {
    try {
        const { catName } = req.body;
        //only string allowed for category name
        const regexString = /^[a-zA-Z]+$/;

        if (!catName) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Can not be empty",
                },
            });
        } else if (!regexString.test(catName)) {
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

module.exports = {
    CategoryView: CategoryView,
    addCategoryView: addCategoryView,
    addCategory: addCategory,
};
