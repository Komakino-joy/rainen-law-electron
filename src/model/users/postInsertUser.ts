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
};

export async function postInsertUser(payload: OwnProps) {
  const { username, f_name, l_name, password, confirmPassword } = payload;

  if (password !== confirmPassword) {
    return {
      message: 'Passwords do not match',
      status: 'error',
    };
  }

  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    bcrypt.genSalt(10, async function (err: any, salt: any) {
      bcrypt.hash(password, salt, async function (err: any, hash: string) {
        if (err) {
          console.log(err);
          return false;
        }

        const insertQuery = pgPromise.as.format(
          `
                  INSERT INTO ${dbRef.table_names.users}
                  (
                    ${dbRef.users.username},
                    ${dbRef.users.f_name},
                    ${dbRef.users.l_name},
                    ${dbRef.users.password},
                    ${dbRef.users.created_at},
                    ${dbRef.users.last_updated}
                  )
                  VALUES (
                    $1, $2, $3, 
                    $4, $5, $6
                  )
      
                  RETURNING *
                ;
              `,
          [username, f_name, l_name, hash, new Date(), new Date()],
        );

        const newRecord = await conn.query(insertQuery);
        await conn.query('COMMIT');

        return {
          newRecord: newRecord.rows[0],
          message: 'New user successfully created',
          status: 'success',
        };
      });
    });
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    console.log(error);
    return {
      // @ts-ignore
      newPropId: null,
      message: 'Failed to insert record',
      status: 'error',
    };
  }
}
