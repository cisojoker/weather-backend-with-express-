const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// function
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// middleware and static files
app.use(express.static("public"));

// Handle POST requests
app.post("/", function (req, res) {
  const query = req.body.cityname;
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=9a53a9485296f4275e78e4618069c0ca";

  https.get(url, function (response) {
    response.on("data", function (data) {
      const wData = JSON.parse(data);
      const desc = wData.weather[0].description;
      const temp = wData.main.temp;
      const icon = wData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Create an HTML response with a card-like format
      const htmlResponse = `
       <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Weather App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/wee.css">
  </head>
  <body style="background: linear-gradient(45deg, #4caf50, #2196F3);">
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2;">
        <h1>Weather Information</h1>
        <h2>Weather in ${query}</h2>
        <h4>Temperature: ${temp} degree Celsius</h4>
        <h4>Condition: ${desc}</h4>
        <img src="${imageUrl}" alt="Weather Icon">
        
        <!-- Add a button to initiate a new search -->
        <form action="/" method="get">
          <button style=" background: #2196f3;
  color: #fff;
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;" type="submit">Search Another City</button>
        </form>
      </div>
    </div>
  </body>
  </html>
      `;

      res.send(htmlResponse);
    });
  });
});

app.listen(8080, function () {
  console.log("App is listening on port 8080");
});
