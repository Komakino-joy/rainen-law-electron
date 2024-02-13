import { dbRef } from '../../constants/dbRefs';
import bcrypt from 'bcrypt';
import { getConn } from '../dbconfig';

export async function postLogin({ username = '', password = '' }) {
  try {
    const conn = await getConn();

    const selectQuery = `
    SELECT * 
    FROM ${dbRef.table_names.users}  
    WHERE LOWER(${dbRef.users.username}) = $1;
          `;
    const queryResults = await conn.query(selectQuery, [
      username.toLowerCase(),
    ]);

    let hash;

    if (queryResults?.rows[0]?.password) {
      hash = queryResults.rows[0][dbRef.users.password];
    } else {
      return {
        message: 'Username does not exist',
        status: 'error',
      };
    }

    const result = await bcrypt.compare(password, hash);

    if (result === true) {
      return {
        status: 'success',
        user: {
          id: queryResults.rows[0][dbRef.users.id],
          username: queryResults.rows[0][dbRef.users.username],
          f_name: queryResults.rows[0][dbRef.users.f_name],
          l_name: queryResults.rows[0][dbRef.users.l_name],
          isAdmin: queryResults.rows[0][dbRef.users.is_admin],
        },
      };
    } else {
      return {
        message: 'Invalid credentials',
        status: 'error',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: 'Something went wrong, check logs.',
      status: 'error',
    };
  }
}
