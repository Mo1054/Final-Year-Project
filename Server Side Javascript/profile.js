const { upload } = require("./middleware/multer");
const getAverageRatings = require("./utlis/getAverage");

// Route handler for web app
module.exports = function (app) {
  //The Code for contact page goes here

  //Render page
  app.get("/profile", function (req, res) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
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
            ...rating,
          });
        }
      });
    }
  });

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
          req.session.user = results[0];
          res.send({ message: "Profile Updated" });
        });
      }
    );
  });
};
