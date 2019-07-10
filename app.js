var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var convert = require("color-convert");
var fs = require("fs");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Logic:.......
// myLogger middleware
app.use(
  function(req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function(req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);
// error middleware
app.use(function(req, res, next) {
  if (req.query.color) {
    console.log("query parameter color available");
    next();
  } else {
    console.log("Error: Missing query parameter color");
    res.status(500).send("Error: Missing query parameter color");
  }
  next();
});

app.get("/", (req, res) => res.send("Hi to Express App"));

app.get("/convert/rgbtohsl", (req, res) =>
  res.send(convert.rgb.hsl(req.query.color))
);

app.get("/convert/keywordtorgb", (req, res) =>
  res.send(convert.keyword.rgb(req.query.color))
);

app.get("/convert/rgbtohex", (req, res) =>
  res.send(convert.rgb.hex(req.query.color))
);

app.get("/convert/hextorgb", (req, res) =>
  res.send(convert.hex.rgb(req.query.color))
);

module.exports = app;
