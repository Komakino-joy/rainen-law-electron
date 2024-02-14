import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postInsTitlesInfo(inmbr: string) {
  try {
    const conn = await getConn();
    const getInsTitlesInfoQuery = `
            SELECT 
              ${dbRef.insurance_titles.id},
              ${dbRef.insurance_titles.i_street},
              ${dbRef.insurance_titles.i_city},
              ${dbRef.insurance_titles.i_lot},
              ${dbRef.insurance_titles.i_condo},
              ${dbRef.insurance_titles.i_unit}
            FROM ${dbRef.table_names.insurance_titles} 
            WHERE ${dbRef.insurance_titles.i_number} = $1
            ORDER BY 
              ${dbRef.insurance_titles.i_city},
              ${dbRef.insurance_titles.i_street},
              ${dbRef.insurance_titles.i_lot};
          `;
    const result = await conn.query(getInsTitlesInfoQuery, [Number(inmbr)]);

    return {
      titles: result.rows,
      count: result.rowCount,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch insurance title info.',
    };
  }
}
