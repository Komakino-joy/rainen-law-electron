import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postDeleteProperty(id: string) {
  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const deletePropertyQuery = pgPromise.as.format(
      `
          DELETE FROM ${dbRef.table_names.properties} p WHERE p.${dbRef.properties.id} = $1;
        `,
      [id],
    );
    await conn.query(deletePropertyQuery);
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
      newPropId: null,
      message: 'Failed to delete record',
      status: 'error',
    };
  }
}
