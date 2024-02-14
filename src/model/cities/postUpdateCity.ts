import pgPromise from 'pg-promise';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

type OwnProps = {
  id: string;
  city: string;
  county: string;
  state_abbrv: string;
};

export async function postUpdateCity(payload: OwnProps) {
  const { id, city, county, state_abbrv } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const updateQuery = pgPromise.as.format(
      `
            UPDATE ${dbRef.table_names.cities}
            SET
              ${dbRef.cities.city}=$1,
              ${dbRef.cities.county}=$2,
              ${dbRef.cities.state_abbrv}=$3
            WHERE ${dbRef.cities.id} = $4
            RETURNING *
          ;
        `,
      [city, county, state_abbrv, id],
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
