import { getConn } from '../dbconfig';

export async function getExaminers() {
  try {
    const conn = await getConn();
    const selectQuery = `SELECT * FROM public.examiners;`;
    const result = await conn.query(selectQuery);

    return {
      status: 'success',
      message: '',
      examiners: result.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch examiners.',
    };
  }
}
