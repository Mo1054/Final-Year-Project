const bcrypt = require("bcrypt");
const countryList = require("./utlis/countryList");
const categories = require("./utlis/categories");
module.exports = function (app) {
  app.get("/signup", function (req, res) {
    if (req.session.user) {
      res.redirect("/profile");
    }
    res.render("signup.ejs", {
      user: req.session.user,
      countryList,
      categories,
    });
  });

  // create new account
  app.post("/signup", function (req, res) {
    const { name, email, country, subcategory, password, confirm_password } =
      req.body;
    if (password !== confirm_password) {
      res.render("signup", {
        error: "Passwords do not match",
        user: req.session.user,
        countryList,
        categories,
      });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      const sql =
        "INSERT INTO users (full_name, email, country, subcategory, password) VALUES (?, ?, ?, ?, ?)";
      const values = [name, email, country, subcategory, hash];
      db.query(sql, values, (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res.render("signup", {
              error:
                "An account with this email already exists. Please use another email.",
              user: req.session.user,
              countryList,
              categories,
            });
          } else {
            throw err;
          }
        } else {
          res.redirect("/login");
        }
      });
    });
  });
};
