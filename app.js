var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var convert = require("color-convert");
var fs = require('fs');


var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Logic:.......

var myLogger = function (req, res, next) {
  console.log('Request Type:', req.method)
  console.log('Request URL:', req.originalUrl)
  next()
};
app.use(myLogger);

var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
};
app.use(requestTime);
app.get("/", (req, res) => res.send(`Hi to Express App .. Date now is : ${req.requestTime}`));

app.get("/convert/rgbtohsl", (req, res) =>
  res.send(convert.rgb.hsl(req.query.color))
);

app.get("/convert/keywordtorgb", (req, res) =>
  res.send(convert.keyword.rgb(req.query.color))
);


// fs.writeFile("./statistics.txt", 'req.query.color', (err) => {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// });

// app.get("/statistic", (req, res) =>
//   res.send(statistics)
//   );

app.get("/convert/rgbtohex", (req, res) =>
  res.send(convert.rgb.hex(req.query.color))
);

app.get("/convert/hextorgb", (req, res) =>
  res.send(convert.hex.rgb(req.query.color))
);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;

