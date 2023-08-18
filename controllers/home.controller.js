const indexView = (req, res, next) => {
    // res.render("layout/home");
    res.render("dashboard", { title: "Dashboard" });
};

const CategoryView = (req, res, next) => {
    // res.render("layout/home");
    res.render("pages/category", { title: "Category" });
};

module.exports = {
    indexView,
    CategoryView,
};
