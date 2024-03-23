// Route handler for web app
module.exports = function (app) {
  //Render page
  app.get("/", async function (req, res) {
    res.render("homepage.ejs");
  });
};
