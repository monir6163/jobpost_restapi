const indexView = (req, res, next) => {
    // res.render("layout/home");
    res.render("dashboard", { title: "Dashboard" });
};

module.exports = {
    indexView,
};
