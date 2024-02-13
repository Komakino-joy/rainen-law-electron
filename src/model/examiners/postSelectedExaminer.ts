import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postSelectedExaminer(id: string) {
  try {
    const conn = await getConn();
    const selectQuery = pgPromise.as.format(
      `
          SELECT * FROM public.examiners 
          WHERE id = $1;
        `,
      [id],
    );

    const queryResults = (await conn.query(selectQuery)).rows;
    return queryResults;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch selected examiner.',
    };
  }
}
