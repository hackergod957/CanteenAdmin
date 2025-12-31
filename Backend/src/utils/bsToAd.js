const NepaliDate = require("nepali-date-converter");

const bsToAd = (bsString) => {
  if (!bsString) return null;

  const [y, m, d] = bsString.split("-").map(Number);

  const ad = new NepaliDate(y, m - 1, d).toJsDate();
  return ad;
};

module.exports = bsToAd;
