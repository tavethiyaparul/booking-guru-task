require("dotenv").config();
const express = require("express");
const { getPollutedCities } = require("./src/services/pollutionService");
const { getWikipediaDescription } = require("./src/services/wikiService");
const { isValidCity } = require("./src/utils/cityValidation");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/cities", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const { pollutedCities, countryCode } = await getPollutedCities();

    const validCities = pollutedCities
      .filter(city => isValidCity(city.name))
      .map(c => ({ name: c.name.trim(), country: c.country, pollution: c.pollution }));

    const countryMap = {
      PL: "Poland",
      DE: "Germany",
      ES: "Spain",
      FR: "France"
    };

    const countryName = countryMap[countryCode] || countryCode;

    const enrichedCities = (
      await Promise.all(
        validCities.map(async (cityData) => {
          const wikiDescription = await getWikipediaDescription(cityData.name.trim().toLowerCase());

          if (!wikiDescription?.description) {
            return null; // Skip if no description
          }

          return {
            ...cityData,
            description: wikiDescription.description,
            country: countryName,
          };
        })
      )
    ).filter(Boolean); // Remove null entries

    const paginatedCities = enrichedCities.slice(startIndex, endIndex);

    return res.json({
      page,
      limit,
      total: Math.ceil(enrichedCities.length),
      cities: paginatedCities
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
