import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getDistinctAssignOptions() {
  try {
    const conn = await getConn();
    const getDistinctAssign = `
            SELECT 
            DISTINCT p.${dbRef.properties.p_assign} 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_assign} IS NOT NULL 
            ORDER BY p.${dbRef.properties.p_assign};
          `;
    const result = await conn.query(getDistinctAssign);

    return result.rows;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch assign options.',
    };
  }
}
