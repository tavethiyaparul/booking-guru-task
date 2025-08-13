const axios = require("axios");

let accessToken = null;
let refreshToken = null;

async function login() {
  const loginResponse = await axios.post(
    `${process.env.MOCK_API_URL}/auth/login`,
    {
      username: "testuser",
      password: "testpass"
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  accessToken = loginResponse.data.token;
  refreshToken = loginResponse.data.refreshToken; // store refresh token
}

async function refreshAccessToken() {
  const refreshResponse = await axios.post(
    `${process.env.MOCK_API_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  accessToken = refreshResponse.data.token; // update access token
}

async function getPollutedCities() {
  let countryCode = process.env.COUNTRY_CODE;

  try {
    if (!accessToken) {
      await login(); // first-time login
    }

    const pollutionResponse = await axios.get(
      `${process.env.MOCK_API_URL}/pollution?country=${countryCode}&page=1&limit=10`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return { pollutedCities: pollutionResponse.data.results, countryCode };

  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token expired. Refreshing...");

      try {
        await refreshAccessToken(); // get new token

        // Retry the pollution API request
        const retryResponse = await axios.get(
          `${process.env.MOCK_API_URL}/pollution?country=${countryCode}&page=1&limit=10`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        return { pollutedCities: retryResponse.data.results, countryCode };

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError.response?.data || refreshError.message);
      }
    } else {
      console.error("Error:", error.response?.data || error.message);
    }
  }
}

module.exports = { getPollutedCities };
