export const andLike = (table: string, field: string, paramNum: string) => {
  return `AND LOWER(${table}."${field}") LIKE '%' || $${paramNum} || '%'`;
};

export const andEquals = (table: string, field: string, paramNum: string) => {
  return `AND ${table}."${field}" = $${paramNum}`;
};

export const andBetweenDate = (
  table: string,
  field: string,
  startParam: string,
  endParam: string
) => {
  return `AND ${table}."${field}" BETWEEN DATE $${startParam} AND DATE $${endParam}`;
};
