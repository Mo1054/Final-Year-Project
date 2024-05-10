const getAverageRatings = require("./utlis/getAverage");
const categories = require("./utlis/categories");
const countryList = require("./utlis/countryList");
const getWeather = require("./utlis/weatherApi");

module.exports = function (app) {
  app.get("/user", async function (req, res) {
    const weather = await getWeather(req);
    const uid = req.query.id;
    if (!uid) {
      res.redirect("/explore");
    }
    const cat = categories.find((c) => c.id == uid);
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [uid], (err, results) => {
      if (err || results.length === 0) {
        return res.redirect("/explore");
      }
      const user = results[0];
      const sql =
        "SELECT ratings.*, users.full_name, users.profile FROM ratings INNER JOIN users ON ratings.rated_by = users.id WHERE user = ?";
      db.query(sql, [uid], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          res.render("user.ejs", {
            user,
            ratings: [],
            avgRating: 0,
            competentAvg: 0,
            likableAvg: 0,
            influentialAvg: 0,
            cat,
            categories,
            countryList,
            userId: req.session?.user?.id || "",
            weather,
          });
        } else {
          const rating = getAverageRatings(results);
          let avgRating =
            (parseFloat(rating.competentAvg) +
              parseFloat(rating.likableAvg) +
              parseFloat(rating.influentialAvg)) /
            3;
          avgRating = avgRating.toFixed(1);
          res.render("user.ejs", {
            user,
            ratings: results,
            avgRating,
            cat,
            categories,
            countryList,
            userId: req.session?.user?.id || "",
            weather,
            ...rating,
          });
        }
      });
    });
  });
};
