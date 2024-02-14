import { TableRefs } from '~/contracts';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = { id: string; selectionType: string };

export async function postSelectedDropDownOption(payload: OwnProps) {
  const { id, selectionType } = payload;

  try {
    const conn = await getConn();
    let query = '';

    switch (selectionType as TableRefs) {
      case 'pType':
        query = 'SELECT * FROM prop_types WHERE id = $1';
        break;
      case 'clientStat':
        query = 'SELECT * FROM client_status WHERE id = $1';
        break;
      case 'pStat':
        query = 'SELECT * FROM prop_status WHERE id = $1';
        break;
      default:
        break;
    }

    const selectStatusCodeQuery = pgPromise.as.format(query, [id]);
    const results = await conn.query(selectStatusCodeQuery);

    return results.rows[0];
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to post selected drop down option.',
    };
  }
}
