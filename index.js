const scraper = require("./scraper.js");
var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000;
var mcache = require("memory-cache");

var cache = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(cachedBody));
      return;
    } else {
      res.endResponse = res.end;
      res.end = (body) => {
        mcache.put(key, JSON.parse(body), duration * 1000);
        res.endResponse(body);
      };
      next();
    }
  };
};

app.listen(port);

app.get("/", cache(180), async (req, res, next) => {
  const result = await scraper.scrape();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});

app.get("/:id", cache(180), async (req, res, next) => {
  const result = await scraper.scrapeByCode(req.params.id);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});

console.log("Chess Ecodoe API server listening on: " + port);
