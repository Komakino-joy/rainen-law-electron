import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';
import bcrypt from 'bcrypt';

type OwnProps = {
  username: string;
  f_name: string;
  l_name: string;
  password: string;
  confirmPassword: string;
  is_admin: string;
  id: string;
};

export async function postUpdateUser(payload: OwnProps) {
  const { username, f_name, l_name, password, confirmPassword, is_admin, id } =
    payload;

  if (password !== confirmPassword) {
    return {
      message: 'Passwords do not match',
      status: 'error',
    };
  }

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    bcrypt.genSalt(10, async function (error: any, salt: any) {
      if (error) {
        console.log(error);
        return false;
      }
      bcrypt.hash(password, salt, async function (error: any, hash: string) {
        if (error) {
          console.log(error);
          return false;
        }

        const updateQuery = pgPromise.as.format(
          `
              UPDATE ${dbRef.table_names.users}
              SET
                ${dbRef.users.username}=$1,
                ${dbRef.users.f_name}=$2,
                ${dbRef.users.l_name}=$3,
                ${password !== '' ? `${dbRef.users.password}=$4,` : ''}  
                ${dbRef.users.is_admin}=$5,
                ${dbRef.users.last_updated}=$6
              WHERE ${dbRef.users.id} = $7
              RETURNING *
            `,
          [username, f_name, l_name, hash, is_admin, new Date(), id],
        );

        const updatedRecord = await conn.query(updateQuery);
        await conn.query('COMMIT');

        return {
          updatedRecord: { ...updatedRecord.rows[0], password },
          message: 'Record Updated',
          status: 'success',
        };
      });
    });
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    console.log(error);
    return {
      message: 'Failed to update record',
      status: 'error',
    };
  }
}
