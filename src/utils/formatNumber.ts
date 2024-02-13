const formatNumber = (strNumber: any) => {
  const number = parseFloat(strNumber);
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default formatNumber