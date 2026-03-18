import numeral from "numeral";

const dollarFilter = value => {
  if (!value) {
    return "$ 0";
  }

  return numeral(value).format("($ 0.00a)");
};

const percentFilter = value => {
  if (!value) {
    return "0%";
  }
  const num = Number(value).toFixed(2);
  return `${num}%`;
};

const rankFilter = value => {
  if (!value) {
    return "";
  }
  return `#${value}`;
};

const fixedFour = value => {
  return value.toFixed(4);
};

export { dollarFilter, percentFilter, rankFilter, fixedFour };
