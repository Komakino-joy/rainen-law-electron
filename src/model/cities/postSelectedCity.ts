import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postSelectedCity(id: string) {
  try {
    const conn = await getConn();
    const selectQuery = pgPromise.as.format(
      `
          SELECT * FROM public.cities 
          WHERE id = $1;
        `,
      [id],
    );

    const queryResults = (await conn.query(selectQuery)).rows[0];
    return queryResults;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch selected city.',
    };
  }
}
