import moment from "moment";

const computeFromNow = (value) => {
  const newDate = new Date(Number(value));
  const fromNow = moment(newDate).diff(moment(), "days");
  const dateString =
    fromNow === 0
      ? "오늘"
      : fromNow < 365
      ? `${fromNow}일전`
      : moment(newDate).format("YY.MM.DD");
  return dateString;
};

export default computeFromNow;
