import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getAllClients() {
  try {
    const conn = await getConn();
    const getAllClientsQuery = `
            SELECT * FROM
              ${dbRef.table_names.clients} c
            WHERE 
              c.${dbRef.clients.c_name} IS NOT NULL
            ORDER BY
              c.${dbRef.clients.last_updated} DESC,
              c.${dbRef.clients.c_name} ASC,
              c.${dbRef.clients.id};
          `;
    const result = await conn.query(getAllClientsQuery);

    return {
      status: 'success',
      message: '',
      clients: result.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch clients.',
    };
  }
}
