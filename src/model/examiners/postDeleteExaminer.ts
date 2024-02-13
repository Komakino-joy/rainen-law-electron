import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postDeleteExaminer(id: string) {
  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const deleteQuery = pgPromise.as.format(
      `
          DELETE FROM public.examiners WHERE id = $1;
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
