const getAverageRatings = require("./utlis/getAverage");
const categories = require("./utlis/categories");
const countryList = require("./utlis/countryList");
const getWeather = require("./utlis/weatherApi");

module.exports = function (app) {
  app.get("/explore", async function (req, res) {
    const weather = getWeather(req);
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
            categories,
            countryList,
            cat: req.query.cat || "all",
            country: req.query.country || "all",
            weather,
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
                    let ratings = getAverageRatings(results);
                    const total = results.length;
                    const category = categories.find(
                      (cat) => cat.id == user.subcategory
                    );
                    resolve({ ...ratings, total, category });
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
          if (req.query.country && req.query.country !== "all") {
            const c = countryList[req.query.country];
            users = users.filter((u) => u.country === c.value);
          }

          if (req.query.cat && req.query.cat !== "all") {
            users = users.filter((u) => u.subcategory == req.query.cat);
          }

          res.render("explore.ejs", {
            user: req.session.user,
            users,
            sort: req.query.sort || "all",
            categories,
            countryList,
            cat: req.query.cat || "all",
            country: req.query.country || "all",
            weather,
          });
        }
      });
    }
  });
};
