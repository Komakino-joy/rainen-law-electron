import { TableRefs } from '~/contracts';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = { id: string; selectionType: string };

export async function postDeleteDropDownOption(payload: OwnProps) {
  const { id, selectionType } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    let query = '';

    switch (selectionType as TableRefs) {
      case 'pType':
        query = 'DELETE FROM prop_types WHERE id = $1;';
        break;
      case 'clientStat':
        query = 'DELETE FROM client_status WHERE id = $1;';
        break;
      case 'pStat':
        query = 'DELETE FROM prop_status WHERE id = $1;';
        break;
      default:
        break;
    }

    const deleteQuery = pgPromise.as.format(query, [id]);

    await conn.query(deleteQuery);

    await conn.query('COMMIT');

    return {
      message: `${selectionType}: ${id} successfully removed.`,
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
