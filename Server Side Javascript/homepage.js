const getAverageRatings = require("./utlis/getAverage");

// Route handler for web app
module.exports = function (app) {
  //The Code for contact page goes here

  //Render page
  app.get("/", function (req, res) {
    if (req.session.user) {
      res.redirect("/profile");
    }
    let sql = "";
    if (!req.session.user) {
      sql = "SELECT * FROM users";
    } else {
      sql = "SELECT * FROM users WHERE id != ?";
    }
    db.query(sql, [req.session.user?.id], async (err, results) => {
      if (err) {
        res.render("index.ejs", {
          user: req.session.user,
          topUsers: [],
        });
      } else {
        let users = await Promise.all(
          results.map(async (user) => {
            let sql = "";
            sql = "SELECT * FROM ratings WHERE user = ?";
            const ratings = await new Promise((resolve, reject) => {
              db.query(sql, [user?.id], (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  // get average rating from results array using rating field
                  const ratings = getAverageRatings(results);

                  let avgRating =
                    (parseFloat(ratings.competentAvg) +
                      parseFloat(ratings.likableAvg) +
                      parseFloat(ratings.influentialAvg)) /
                    3;
                  //add rating to one digit after the decimal
                  // avgRating = avgRating.toFixed(1);
                  const total = results.length;
                  resolve({ avgRating, total, ...ratings });
                }
              });
            });
            return {
              ...user,
              ...ratings,
            };
          })
        );
        users = users.filter((user) => user.total > 0);
        users = users.sort((a, b) => b.total - a.total);
        users = users.sort((a, b) => b.avgRating - a.avgRating);
        users = users.slice(0, 4);
        res.render("index.ejs", {
          user: req.session.user,
          topUsers: users,
        });
      }
    });
  });
};
