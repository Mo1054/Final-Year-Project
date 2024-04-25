const getAverageRatings = require("./utlis/getAverage");

// Route handler for web app
module.exports = function (app) {
  //The Code for contact page goes here

  //Render page
  app.get("/explore", function (req, res) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      const sql = "SELECT * FROM users WHERE id != ?";
      db.query(sql, [req.session.user.id], async (err, results) => {
        if (err) {
          res.render("explore.ejs", {
            user: req.session.user,
            users: [],
            sort: req.query.sort || "all",
          });
        } else {
          let data = results;
          if (req.query.query) {
            data = data.filter((user) =>
              user.full_name
                .toLowerCase()
                .includes(req.query.query.toLowerCase())
            );
          }
          let users = await Promise.all(
            data.map(async (user) => {
              let sql = "";
              sql = "SELECT * FROM ratings WHERE user = ?";
              const ratings = await new Promise((resolve, reject) => {
                db.query(sql, [user.id], (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    // get average rating from results array using rating field
                    let ratings = getAverageRatings(results);
                    //add rating to one digit after the decimal
                    const total = results.length;
                    resolve({ ...ratings, total });
                  }
                });
              });
              return {
                ...user,
                ...ratings,
              };
            })
          );
          if (req.query.sort === "suggested") {
            users = users.sort((a, b) => b.total - a.total);
          } else if (req.query.sort === "featured") {
            users = users.sort((a, b) => b.avgRating - a.avgRating);
          }
          res.render("explore.ejs", {
            user: req.session.user,
            users,
            sort: req.query.sort || "all",
          });
        }
      });
    }
  });
};
