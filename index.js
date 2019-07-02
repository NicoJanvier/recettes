
const express = require("express");
const path = require("path");
// var cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const router = require("./express/router");
const app = express();


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(express.static(path.join(__dirname, "build")));


// append /api for our http requests
app.use("/api", router);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// launch our backend into a port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
