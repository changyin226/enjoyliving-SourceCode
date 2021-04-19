export default function (timestamp) {
  const dateline = new Date();
  dateline.setTime(timestamp * 1000);
  const year = dateline.getFullYear();
  let month = dateline.getMonth() + 1;
  if (month < 10) month = `0${month}`;
  let date = dateline.getDate();
  if (date < 10) date = `0${date}`;
  return `${year}/${month}/${date}`;
}
