const getAverageRatings = require("./utlis/getAverage");
const getWeather = require("./utlis/weatherApi");

module.exports = function (app) {
  app.get("/", async function (req, res) {
    const weather = await getWeather(req);

    let sql = "";
    if (!req.session.user) {
      sql = "SELECT * FROM users";
    } else {
      sql = "SELECT * FROM users WHERE id != ?";
    }
    db.query(sql, [req.session.user?.id], async (err, results) => {
      if (err) {
        res.render("index.ejs", {
          user: req.session.user || null,
          topUsers: [],
          userId: req.session?.user?.id || "",
          weather,
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
                  const ratings = getAverageRatings(results);

                  let avgRating =
                    (parseFloat(ratings.competentAvg) +
                      parseFloat(ratings.likableAvg) +
                      parseFloat(ratings.influentialAvg)) /
                    3;
                  const total = results.length;
                  avgRating = avgRating.toFixed(1);
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
          user: req.session.user || null,
          topUsers: users,
          userId: req.session?.user?.id || "",
          weather,
        });
      }
    });
  });
};
