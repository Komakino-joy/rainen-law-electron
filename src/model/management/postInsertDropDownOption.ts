import { TableRefs } from '~/contracts';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = { code: string; description: string; selectionType: string };

export async function postInsertDropDownOption(payload: OwnProps) {
  const { code, description, selectionType } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    let query = '';

    switch (selectionType as TableRefs) {
      case 'pType':
        query =
          'INSERT INTO prop_types (type_code, type_desc) VALUES ($1, $2) RETURNING *;';
        break;
      case 'clientStat':
        query =
          'INSERT INTO client_status (status_code, status_desc) VALUES ($1, $2) RETURNING *;';
        break;
      case 'pStat':
        query =
          'INSERT INTO prop_status (status_code, status_desc) VALUES ($1, $2) RETURNING *;';
        break;
      default:
        break;
    }

    const addNewStatusQuery = pgPromise.as.format(query, [code, description]);

    const newRecord = await conn.query(addNewStatusQuery);
    await conn.query('COMMIT');

    return {
      newRecord: newRecord.rows[0],
      message: 'New record inserted',
      status: 'success',
    };
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    if ((error as any).code === '23505') {
      return {
        message: 'Record with the same code already exists.',
        status: 'error',
      };
    } else {
      return {
        message: 'Failed to insert record',
        status: 'error',
      };
    }
  }
}
