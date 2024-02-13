import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getUsers() {
  try {
    const conn = await getConn();
    const selectQuery = `
          SELECT 
            ${dbRef.users.id} , 
            ${dbRef.users.f_name} , 
            ${dbRef.users.l_name} , 
            ${dbRef.users.username} , 
            ${dbRef.users.password} ,
            ${dbRef.users.is_admin}   
          FROM ${dbRef.table_names.users}
          WHERE ${dbRef.users.username} != 'admin'
          ;
        `;
    const result = await conn.query(selectQuery);

    return result.rows;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch users.',
    };
  }
}
