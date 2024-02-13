import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getLatestUpdatedClients() {
  try {
    const conn = await getConn();
    const getAllClientsQuery = `
            SELECT * FROM
              ${dbRef.table_names.clients} cm
            WHERE 
              cm.${dbRef.clients.c_name} IS NOT NULL
            ORDER BY
              cm.${dbRef.clients.last_updated} DESC,
              cm.${dbRef.clients.c_name} ASC,
              cm.${dbRef.clients.id}
            LIMIT 10;
          `;
    const result = await conn.query(getAllClientsQuery);

    return {
      status: 'success',
      data: result.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch latest updated clients.',
    };
  }
}
