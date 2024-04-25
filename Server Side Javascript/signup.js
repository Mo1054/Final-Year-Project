// Route handler for web app
const bcrypt = require("bcrypt");

module.exports = function (app) {
  //The Code for contact page goes here

  //Render page
  app.get("/signup", function (req, res) {
    if (req.session.user) {
      res.redirect("/profile");
    }
    res.render("signup.ejs", {
      user: req.session.user,
    });
  });

  app.post("/signup", function (req, res) {
    // Handle the sign up logic here
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      res.render("signup", {
        error: "Passwords do not match",
        user: req.session.user,
      });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      const sql =
        "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
      const values = [name, email, hash];
      db.query(sql, values, (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res.render("signup", {
              error:
                "An account with this email already exists. Please use another email.",
              user: req.session.user,
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
