const scraper = require("./scraper.js");
var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

app.get("/", async (req, res, next) => {
  const result = await scraper.scrape();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});

app.get("/:id", async (req, res, next) => {
  const result = await scraper.scrapeByCode(req.params.id);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});

console.log("todo list RESTful API server started on: " + port);
