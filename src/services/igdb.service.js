const axios = require("axios");
const { getIGDBToken } = require("../utils/igdbToken");

const IGDB_URL = "https://api.igdb.com/v4";

const igdbRequest = async (endpoint, query) => {
  const token = await getIGDBToken();

  const res = await axios.post(`${IGDB_URL}/${endpoint}`, query, {
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

exports.searchGames = async (search) => {
  return igdbRequest(
    "games",
    `
      search "${search}";
      fields id, name, cover.url, first_release_date;
      limit 10;
    `
  );
};

exports.getGameById = async (igdbId) => {
  return igdbRequest(
    "games",
    `
      where id = ${igdbId};
      fields id, name, summary, platforms.name, genres.name, cover.url;
    `
  );
};

exports.searchCharacters = async (search) => {
  return igdbRequest(
    "characters",
    `
      search "${search}";
      fields name, mug_shot.url;
      limit 10;
    `
  );
};
