import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postDeleteUser(id: string) {
  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const deleteQuery = pgPromise.as.format(
      `
            DELETE FROM ${dbRef.table_names.users} 
            WHERE ${dbRef.users.id} = $1;
        `,
      [id],
    );
    await conn.query(deleteQuery);
    await conn.query('COMMIT');

    return {
      message: `Property: ${id} successfully removed.`,
      status: 'success',
    };
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    console.log(error);
    return {
      // @ts-ignore
      newId: null,
      message: 'Failed to delete record',
      status: 'error',
    };
  }
}
