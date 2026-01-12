const axios = require("axios");

let tokenCache = {
  token: null,
  expiresAt: null,
};

exports.getIGDBToken = async () => {
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  tokenCache.token = res.data.access_token;
  tokenCache.expiresAt = Date.now() + res.data.expires_in * 1000;

  return tokenCache.token;
};
