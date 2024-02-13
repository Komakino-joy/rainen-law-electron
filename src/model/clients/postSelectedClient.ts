import pgPromise from 'pg-promise';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postSelectedClient(clientId: string) {
  try {
    const conn = await getConn();
    const clientByIdQuery = pgPromise.as.format(
      `
          SELECT 
            * 
          FROM 
            ${dbRef.table_names.clients} 
          WHERE 
            ${dbRef.clients.id} = $1;
        `,
      [clientId],
    );

    const clientByIdResults = (await conn.query(clientByIdQuery)).rows;
    return clientByIdResults;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: "Unable to fetch selected client's data.",
    };
  }
}
