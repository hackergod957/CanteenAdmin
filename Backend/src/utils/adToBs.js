const NepaliDate = require("nepali-date-converter");

const adToBs = (adDate) => {
  if (!adDate) return null;

  const date =
    adDate instanceof Date ? adDate : new Date(adDate);

  const bs = new NepaliDate(date);

  const year = bs.getYear();
  const month = String(bs.getMonth() + 1).padStart(2, "0");
  const day = String(bs.getDate()).padStart(2, "0");

  return {
    year,
    month: Number(month),
    day: Number(day),
    formatted: `${year}-${month}-${day}`
  };
};

module.exports = adToBs;
