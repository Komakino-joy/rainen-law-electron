import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getLatestUpdatedProperties() {
  try {
    const conn = await getConn();
    const allProperties = `
          SELECT 
            c.${dbRef.clients.c_name},
            p.${dbRef.properties.p_input_date},
            p.${dbRef.properties.p_city},
            p.${dbRef.properties.p_street},
            p.${dbRef.properties.p_lot},
            p.${dbRef.properties.p_condo},
            p.${dbRef.properties.p_unit},
            p.${dbRef.properties.p_number},
            p.${dbRef.properties.p_requester},
            p.${dbRef.properties.p_type},
            p.${dbRef.properties.p_status},
            p.${dbRef.properties.p_comp_ref},
            p.${dbRef.properties.p_instructions},
            p.${dbRef.properties.id}
          FROM ${dbRef.table_names.properties} p
          LEFT JOIN ${dbRef.table_names.clients} c 
          ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
          ORDER BY 
            p.${dbRef.properties.last_updated} DESC,
            p.${dbRef.properties.p_input_date} DESC,
            p.${dbRef.properties.id}
          LIMIT 10
        `;
    const propertiesResults = (await conn.query(allProperties)).rows;

    return propertiesResults;
  } catch (error) {
    console.log(error);
    return { message: 'Failed to get properties' };
  }
}
