import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = {
  city: string;
  county: string;
  state_abbrv: string;
};

export async function postInsertCity(payload: OwnProps) {
  const { city, county, state_abbrv } = payload;
  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const insertQuery = pgPromise.as.format(
      `
            INSERT INTO public.cities
            (
              city,
              county,
              state_abbrv
            )
            VALUES (
              $1, $2, $3
            )

            RETURNING *
          ;
        `,
      [city, county, state_abbrv],
    );

    const newRecord = await conn.query(insertQuery);
    await conn.query('COMMIT');

    return {
      newRecord: newRecord.rows[0],
      message: 'New record inserted',
      status: 'success',
    };
  } catch (error) {
    const conn = await getConn();
    await conn.query('ROLLBACK');
    console.log(error);
    return {
      // @ts-ignore
      newPropId: null,
      message: 'Failed to insert record',
      status: 'error',
    };
  }
}
