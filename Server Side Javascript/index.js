// My wep appp

// Import the modules we need
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
// const mime = require("mime");
const session = require("express-session");

// Define the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "forumapp",
  password: "qwerty",
  database: "rateMe",
});


// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

// Create the express application object
const app = express();
const port = 8000;

app.use(
  session({
    secret: "secretkeyforrateme",
    resave: true,
    saveUninitialized: true,
  })
);
//Use bodyParser in express
app.use(bodyParser.urlencoded({ extended: true }));

// Set the directory where static files (css, js, etc) will be
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "..", "Css")));

app.use(express.static(path.join(__dirname, "..", "Client Side Javascript")));

app.use(express.static(path.join(__dirname, "..", "Images")));

// app.use(express.static(path.join(__dirname, 'Client Side Javascript')));

// This is the code Gvidas has
// Set the directory where static files (css, js, etc) will be
// app.use(express.static(path.join(__dirname, '..', 'Css')));
// app.use(express.static(path.join(__dirname, '..', 'Images')));
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));
// app.use('/Client_Side_Javascript', express.static(path.join(__dirname, '..', 'Client_Side_Javascript')));
// end of Gvidas Block

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// We want to use EJS's rendering engine

app.engine("html", ejs.renderFile);

// Tells Express how we should process html files

app.set("views", path.join(__dirname, "..", "Html"));

//Requires all the modules for the different pages

require("./homepage")(app);
require("./login")(app);
require("./signup")(app);
require("./profile")(app);
require("./explore")(app);
require("./rating")(app);
require("./contact")(app);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Gvidas code (but the dark mode and validation doesnt work...)
// app.get('/Client_Side_Javascript/review.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     res.sendFile(path.join(__dirname, '..', 'Client_Side_Javascript', 'review.js'));
// });
// app.get('/Client_Side_Javascript/validation.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     res.sendFile(path.join(__dirname, '..', 'Client_Side_Javascript', 'validation.js'));
// });
//end of Gvidas block
