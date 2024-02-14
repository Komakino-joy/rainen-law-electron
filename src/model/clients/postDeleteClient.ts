import pgPromise from 'pg-promise';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postDeleteClient(id: string) {
  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const deleteQuery = pgPromise.as.format(
      `
          DELETE FROM ${dbRef.table_names.clients} c WHERE c.${dbRef.clients.id} = $1;
        `,
      [id],
    );

    await conn.query(deleteQuery);
    await conn.query('COMMIT');

    return {
      message: `Client: ${id} successfully removed.`,
      status: 'success',
    };
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    console.log(error);
    return {
      // @ts-ignore
      newPropId: null,
      message: 'Failed to delete record',
      status: 'error',
    };
  }
}
