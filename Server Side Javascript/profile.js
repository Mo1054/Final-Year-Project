const { upload } = require("./middleware/multer");
const getAverageRatings = require("./utlis/getAverage");
const categories = require("./utlis/categories");
const countryList = require("./utlis/countryList");
const getWeather = require("./utlis/weatherApi");

module.exports = function (app) {
  app.get("/profile", async function (req, res) {
    const weather = await getWeather(req);
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      // geting user category from categories list
      const cat = categories.find((c) => c.id == req.session.user.subcategory);
      const sql =
        "SELECT ratings.*, users.full_name, users.profile FROM ratings INNER JOIN users ON ratings.rated_by = users.id WHERE user = ?";
      db.query(sql, [req.session.user.id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          res.render("profile.ejs", {
            user: req.session.user,
            ratings: [],
            avgRating: 0,
            competentAvg: 0,
            likableAvg: 0,
            influentialAvg: 0,
            cat,
            categories,
            countryList,
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
          res.render("profile.ejs", {
            user: req.session.user,
            ratings: results,
            avgRating,
            cat,
            categories,
            countryList,
            weather,
            ...rating,
          });
        }
      });
    }
  });
// upload profile picture
  app.post("/uploadProfile", upload.single("file"), function (req, res) {
    if (!req.session.user.id) {
      res.redirect("/login");
    }
    const sql = "UPDATE users SET profile = ? WHERE id = ?";
    db.query(
      sql,
      [`uploads/${req.file.filename}`, req.session.user.id],
      (err, results) => {
        if (err) {
          res.status(500).send({ error: "Error while uploading profile" });
        }
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [req.session.user.id], (err, results) => {
          if (err)
            res.status(500).send({ error: "Error while uploading profile" });
          // update current user session info
          req.session.user = results[0];
          res.send({ message: "Profile Updated" });
        });
      }
    );
  });

  // Update Profile info
  app.post("/updateProfile", upload.single("file"), function (req, res) {
    if (!req.session.user.id) {
      res.redirect("/login");
    }
    const { name, country, subcategory, fb, linkedin } = req.body;
    const sql =
      "UPDATE users SET full_name = ?, fb = ?, linkedin = ?, country = ?, subcategory = ? WHERE id = ?";
    db.query(
      sql,
      [name, fb, linkedin, country, subcategory, req.session.user.id],
      (err, results) => {
        if (err) {
          res.status(500).send({ error: "Error while updating profile" });
        }
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [req.session.user.id], (err, results) => {
          if (err)
            res.status(500).send({ error: "Error while uploading profile" });
          // update current user session info
          req.session.user = results[0];
          res.redirect("/profile");
        });
      }
    );
  });
};
