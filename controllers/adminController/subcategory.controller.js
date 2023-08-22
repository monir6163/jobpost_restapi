const models = require("../../models");

const SubCategoryView = async (req, res) => {
    //get all categories and subcategories from database and pass it to the view page to display
    const subcategories = await models.Subcategory.findAll({
        include: [
            {
                model: models.Category,
                as: "category",
            },
        ],
        order: [["id", "DESC"]],
    });
    res.render("pages/subcategory/viewsubcat", {
        title: "Subcategory",
        subcategories: subcategories,
    });
};

const addSubCategoryView = async (req, res) => {
    //get all categories from database and pass it to the view page to display
    const categories = await models.Category.findAll({
        order: [["id", "DESC"]],
    });

    res.render("pages/subcategory/addsubcat", {
        title: "Add Subcategory",
        categories: categories,
    });
};

//create a new Subcategory
const addSubCategory = async (req, res) => {
    try {
        const { subcat, catId } = req.body;
        //only string allowed for category name
        const regexString = /^[a-zA-Z]+$/;

        if (!subcat || !catId) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Can not be empty",
                },
            });
        } else if (!regexString.test(subcat)) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be Vaild",
                },
            });
        } else if (subcat.length < 3) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be at least 3 characters",
                },
            });
        } else if (subcat.length > 20) {
            return res.status(400).json({
                status: "error",
                errors: {
                    message: "Name must be less than 20 characters",
                },
            });
        }
        // check if category already exists
        const categoryExists = await models.Subcategory.findOne({
            where: {
                name: subcat,
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

        //create a new subcategory
        const subcategory = await models.Subcategory.create({
            name: subcat,
            categoryId: catId,
        });
        res.status(201).json({
            status: "success",
            message: "Subcategory created successfully",
            data: {
                subcategory,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            errors: {
                message: "Server error",
            },
        });
    }
};

module.exports = {
    SubCategoryView: SubCategoryView,
    addSubCategoryView: addSubCategoryView,
    addSubCategory: addSubCategory,
};
