const axios = require("axios");
const cache = require("../utils/cache");

async function getWikipediaDescription(city) {
  const cached = cache.get(city);
  if (cached) return cached;
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    const { data } = await axios.get(url);

    if (data.extract) {
      cache.set(city,{description: data.extract,country:data.description});
      return {
      description: data.extract || "No description available",
      country: data.description || "Unknown"
    };

    }
  } catch (error) {
    console.error(`Wikipedia fetch failed for ${city}:`, error.message);
  }

  return "Description not available";
}

module.exports = { getWikipediaDescription };
