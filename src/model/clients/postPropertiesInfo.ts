import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postPropertiesInfo(c_number: string) {
  try {
    const conn = await getConn();
    const getClientPropertyInfoQuery = `
            SELECT * 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_number} = $1
            ORDER BY 
              p.${dbRef.properties.p_input_date}  DESC,
              p.${dbRef.properties.p_city},
              p.${dbRef.properties.p_street};
          `;
    const result = await conn.query(getClientPropertyInfoQuery, [
      Number(c_number),
    ]);
    return {
      status: 'success',
      message: '',
      propertiesInfo: result.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: "Unable to fetch client's properties info",
    };
  }
}
