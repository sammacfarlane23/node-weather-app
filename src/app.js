const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geoCode = require("./utils/geoCode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Sam MacFarlane la",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Sam MacFarlane la",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text kidder",
    title: "Help",
    name: "Sam MacFarlane",
  });
});

app.get("/weather", (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({
      error: "Address must be provided!",
    });
  }

  geoCode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({ forecast: forecastData, location, address });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found.",
    name: "Sam MacFarlane",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found.",
    name: "Sam MacFarlane",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
