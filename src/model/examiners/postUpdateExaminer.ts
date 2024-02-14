import pgPromise from 'pg-promise';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

type OwnProps = {
  name: string;
  code: string;
  type: string;
  compensate: string;
  is_active: string;
  id: string;
};

export async function postUpdateExaminer(payload: OwnProps) {
  const { name, code, type, compensate, is_active, id } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const updateQuery = pgPromise.as.format(
      `
            UPDATE ${dbRef.table_names.examiners}
            SET
              ${dbRef.examiners.name}=$1,
              ${dbRef.examiners.code}=$2,
              ${dbRef.examiners.type}=$3,
              ${dbRef.examiners.compensate}=$4,
              ${dbRef.examiners.is_active}=$5,
              ${dbRef.examiners.last_updated}=$6
            WHERE ${dbRef.examiners.id} = $7
            RETURNING *
          ;
        `,
      [name, code, type, compensate, is_active, new Date(), id],
    );

    const updatedRecord = await conn.query(updateQuery);
    await conn.query('COMMIT');

    return {
      updatedRecord: updatedRecord.rows[0],
      message: 'Record Updated',
      status: 'success',
    };
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
