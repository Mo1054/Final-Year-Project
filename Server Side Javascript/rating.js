const getAverageRatings = require("./utlis/getAverage");

// Route handler for web app
module.exports = function (app) {
  //The Code for contact page goes here

  //Render page
  app.get("/rating", function (req, res) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      const sql =
        "SELECT users.*, ratings.* FROM users LEFT JOIN ratings ON users.id = ratings.user WHERE users.id = ?";
      db.query(sql, [req.query.id], (err, results) => {
        console.log(results);
        if (err) throw err;
        if (results.length <= 0) {
          res.send("User not found");
        } else {
          const user = results[0];
          if (results[0].likable_rating) {
            var ratings = getAverageRatings(results);
            var total = results.length;
          } else {
            var ratings = { competentAvg: 0, likableAvg: 0, influentialAvg: 0 };
            var total = 0;
          }
          res.render("rating.ejs", {
            ...ratings,
            total,
            user: req.session.user,
            user_info: user,
            options: ["Very", "Yes", "Somewhat", "No"],
          });
        }
      });
    }
  });
  app.post("/rating", function (req, res) {
    const {
      user,
      rated_by,
      comment,
      competent_rating,
      likable_rating,
      influential_rating,
    } = req.body;
    const sql =
      "INSERT INTO ratings (user, rated_by, comment, competent_rating, likable_rating, influential_rating) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        user,
        rated_by,
        comment,
        competent_rating,
        likable_rating,
        influential_rating,
      ],
      (err, results) => {
        if (err) throw err;
        res.redirect("/explore");
      }
    );
  });
};
