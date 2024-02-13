import { TableRefs } from '~/contracts';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = {
  id: string;
  code: string;
  description: string;
  selectionType: string;
};

export async function postUpdateDropDownOptions(payload: OwnProps) {
  const { id, code, description, selectionType } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    let query = '';

    switch (selectionType as TableRefs) {
      case 'pType':
        query =
          'UPDATE prop_types SET type_code=$1, type_desc=$2 WHERE id = $3 RETURNING *;';
        break;
      case 'clientStat':
        query =
          'UPDATE client_status SET status_code=$1, status_desc=$2 WHERE id = $3 RETURNING *;';
        break;
      case 'pStat':
        query =
          'UPDATE prop_status SET status_code=$1, status_desc=$2 WHERE id = $3 RETURNING *;';
        break;
      default:
        break;
    }

    const updateStatusCodeQuery = pgPromise.as.format(query, [
      code,
      description,
      id,
    ]);

    const updatedRecord = await conn.query(updateStatusCodeQuery);
    await conn.query('COMMIT');

    return {
      updatedRecord: updatedRecord.rows[0],
      message: 'Record updated',
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
