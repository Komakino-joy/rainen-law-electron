export default function timestampToDate(
  timestamp: string | number,
  format: "yyyyMMdd" | "mmDDyyyy"
) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();

  let mm: string | number = date.getMonth() + 1;
  let dd: string | number = date.getDate();
  let hh: string | number = date.getHours();
  let min: string | number = date.getMinutes();
  let secs: string | number = date.getMinutes();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  const formatMap = {
    yyyyMMdd: yyyy + "-" + mm + "-" + dd,
    mmDDyyyy: mm + "/" + dd + "/" + yyyy,
  };

  return {
    date: formatMap[format],
    time: " (" + hh + ":" + min + ":" + secs + ")",
  };
}
