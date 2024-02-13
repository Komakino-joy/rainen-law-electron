import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getDistinctStatusOptions() {
  try {
    const conn = await getConn();
    const getDistinctTypes = `
            SELECT DISTINCT p.${dbRef.properties.p_status} 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_status} IS NOT NULL
            ORDER BY p.${dbRef.properties.p_status} ASC;
          `;
    const result = await conn.query(getDistinctTypes);

    return result.rows;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch status options.',
    };
  }
}
