const getWeather = require("./utlis/weatherApi");

module.exports = function (app) {
  app.get("/contact", async function (req, res) {
    const weather = await getWeather(req);
    res.render("contact.ejs", {
      user: req.session.user,
      weather,
    });
  });
};
