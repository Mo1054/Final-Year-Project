const bcrypt = require("bcrypt");
module.exports = function (app) {
  app.get("/login", function (req, res) {
    if (req.session.user) {
      res.redirect("/profile");
    }
    res.render("login.ejs", {
      user: req.session.user,
    });
  });

  app.post("/login", function (req, res) {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.send("User not found");
      } else {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            req.session.cookie.expires = new Date(
              Date.now() + 1000 * 60 * 60 * 24
            );
            req.session.user = user;
            res.redirect("/profile");
          } else {
            res.render("login.ejs", {
              error: "Incorrect password",
              user: req.session.user,
            });
          }
        });
      }
    });
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    });
  });
};
