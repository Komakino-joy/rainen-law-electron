import { Client } from '~/contracts';
import pgPromise from 'pg-promise';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postUpdateClient(payload: Partial<Client>) {
  const {
    c_name,
    c_address_1,
    c_address_2,
    c_city,
    c_state,
    c_zip,
    c_phone,
    c_fax,
    c_contact,
    c_status,
    c_statement_addressee,
    c_email,
    c_notes,
    last_updated_by,
    id,
  } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    const updateClientQuery = pgPromise.as.format(
      `
          UPDATE ${dbRef.table_names.clients} 
          SET
            ${dbRef.clients.c_name} = $1,
            ${dbRef.clients.c_address_1} = $2,
            ${dbRef.clients.c_address_2} = $3,
            ${dbRef.clients.c_city} = $4,
            ${dbRef.clients.c_state} = $5,
            ${dbRef.clients.c_zip} = $6,
            ${dbRef.clients.c_phone} = $7,
            ${dbRef.clients.c_fax} = $8,
            ${dbRef.clients.c_contact} = $9,
            ${dbRef.clients.c_status} = $10,
            ${dbRef.clients.c_statement_addressee} = $11, 
            ${dbRef.clients.c_email} = $12,
            ${dbRef.clients.c_notes} = $13,
            ${dbRef.clients.last_updated_by} = $14,
            ${dbRef.clients.last_updated} = $15
          
          WHERE ${dbRef.clients.id} = $16
          RETURNING *;

        `,
      [
        c_name,
        c_address_1,
        c_address_2,
        c_city,
        c_state,
        c_zip,
        c_phone,
        c_fax,
        c_contact,
        c_status,
        c_statement_addressee,
        c_email,
        c_notes,
        last_updated_by,
        new Date(),
        id,
      ],
    );

    const updatedRecord = await conn.query(updateClientQuery);
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
