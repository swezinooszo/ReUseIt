const sha256 = require('crypto-js/sha256');

const getObfuscatedCoordinates = (listingId, longitude, latitude) => {
  const hash = sha256(listingId).toString();
  const latOffsetSeed = parseInt(hash.substring(0, 8), 16);
  const lngOffsetSeed = parseInt(hash.substring(8, 16), 16);

  // % 10000 keeps only the last 4 digits, giving a value between 0 and 9999.
  // /10000 Converts that number to a decimal between 0.0 and 0.9999.
  // - 0.5 This shifts the range: From: 0.0 → 0.9999 To: -0.5 → +0.4999
  // * 0.01 This scales down the offset to the desired range: (-0.5 to 0.4999) × 0.01 = ~ -0.005 to +0.005
  // How far is 0.005 degrees? Latitude: ~111,000 meters per degree → 0.005 × 111,000 = ~555 meters
  // Longitude: depends on latitude, but in most cities it's ~300–400 meters at that offset
  // summary: "Generate a small, consistent, random offset between -0.005 and +0.005 degrees, based on the hash of the listing ID."

  //Effect of 0.001 => Max offset: ~ 55 meters latitude, ~ 30–45 meters longitude (varies by location)
  const latOffset = ((latOffsetSeed % 10000) / 10000 - 0.5) * 0.001;//* 0.01;
  const lngOffset = ((lngOffsetSeed % 10000) / 10000 - 0.5) * 0.001;//* 0.01;

  return {
    latitude: latitude + latOffset,
    longitude: longitude + lngOffset,
  };
};

module.exports = { getObfuscatedCoordinates };
