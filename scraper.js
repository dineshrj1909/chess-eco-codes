const requestPromise = require("request-promise");
const cheerio = require("cheerio");

const scrape = async () => {
  let results = [];
  await requestPromise(
    "https://www.chessgames.com/chessecohelp.html",
    (err, res, html) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(html);
        $("td[valign]").each((i, node) => {
          const ecoCode = $(node).text();
          const ecoCodeDetails = $(node).next().text().split("\n");
          const ecoCodeTitle = ecoCodeDetails[0];
          const ecoCodeSteps = ecoCodeDetails[1];
          results.push({
            ecoCode,
            ecoCodeTitle,
            ecoCodeSteps,
          });
        });
      }
    }
  );
  return results;
};

const scrapeByCode = async (code) => {
  let result = {};
  await requestPromise(
    "https://www.chessgames.com/chessecohelp.html",
    (err, res, html) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(html);
        const node = $(`td[valign]:contains("${code}")`);
        const ecoCode = $(node).text();
        const ecoCodeDetails = $(node).next().text().split("\n");
        const ecoCodeTitle = ecoCodeDetails[0];
        const ecoCodeSteps = ecoCodeDetails[1];
        result = {
          ecoCode,
          ecoCodeTitle,
          ecoCodeSteps,
        };
      }
    }
  );
  return result;
};

module.exports = { scrape, scrapeByCode };
