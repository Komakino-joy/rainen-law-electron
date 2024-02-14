import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postSelectedUser(id: string) {
  try {
    const conn = await getConn();
    const selectQuery = pgPromise.as.format(
      `
          SELECT 
            ${dbRef.users.id}, 
            ${dbRef.users.f_name}, 
            ${dbRef.users.l_name}, 
            ${dbRef.users.username}, 
            ${dbRef.users.password}, 
            ${dbRef.users.is_admin}
          FROM ${dbRef.table_names.users} 
          WHERE ${dbRef.users.id} = $1;
        `,
      [id],
    );

    const queryResults = (await conn.query(selectQuery)).rows[0];
    return queryResults;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch selected user.',
    };
  }
}
