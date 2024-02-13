import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = {
  exName: string;
  exCode: string;
  exType: string;
  exCompensate: string;
  exIsActive: string;
};

export async function postInsertExaminer(payload: OwnProps) {
  const { exName, exCode, exType, exCompensate, exIsActive } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');
    const insertQuery = pgPromise.as.format(
      `
            INSERT INTO public.examiners
            (
              name,
              code,
              type,
              compensate,
              is_active,
              created_at,
              last_updated
            )
            VALUES (
              $1, $2, $3, 
              $4, $5, $6, $7
            )

            RETURNING *
          ;
        `,
      [
        exName,
        exCode,
        exType,
        exCompensate,
        exIsActive,
        new Date(),
        new Date(),
      ],
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
      status: 'failure',
    };
  }
}
