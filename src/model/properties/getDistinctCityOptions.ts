import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getDistinctCityOptions() {
  try {
    const conn = await getConn();
    const getDistinctCities = `
        SELECT DISTINCT TRIM(p.${dbRef.properties.p_city}) AS ${dbRef.properties.p_city}
        FROM ${dbRef.table_names.properties} p 
        ORDER BY ${dbRef.properties.p_city};
      `;
    const result = await conn.query(getDistinctCities);

    return result.rows;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch city options.',
    };
  }
}
