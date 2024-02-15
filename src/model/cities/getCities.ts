import { getConn } from '../dbconfig';

export async function getCities() {
  try {
    const conn = await getConn();
    const getAllCitiesQuery = `SELECT * FROM cities ORDER BY state_abbrv, city;`;
    const result = await conn.query(getAllCitiesQuery);

    return {
      status: 'success',
      message: '',
      cities: result.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch cities.',
    };
  }
}
