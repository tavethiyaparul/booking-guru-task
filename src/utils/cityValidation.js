function isValidCity(cityName) {
  if (!cityName || typeof cityName !== "string") return false;

  // Remove leading/trailing spaces and check length
  const cleaned = cityName.trim();

  // Filter out too short names, numeric values, or containing only special chars
  if (cleaned.length < 2 || /\d/.test(cleaned) || /^[^a-zA-Z]+$/.test(cleaned)) {
    return false;
  }

  // Example: avoid country names (basic check)
  const invalidKeywords = ["Province", "Region", "District", "Country"];
  if (invalidKeywords.some(k => cleaned.toLowerCase().includes(k.toLowerCase()))) {
    return false;
  }

  return true;
}

module.exports = { isValidCity };
