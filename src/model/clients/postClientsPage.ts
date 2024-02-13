import pgPromise from 'pg-promise';
import { andEquals } from '../../constants/dbClauses';
import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function postClientsPage(page: string, filters: string) {
  try {
    const conn = await getConn();
    const pageSize = 100;
    const pageOffset = pageSize * (Number(page) - 1);

    const {
      c_name = '',
      c_number = '',
      c_city = '',
      c_contact = '',
      c_email = '',
      c_fax = '',
      c_phone = '',
      c_status = '',
      c_state = '',
      c_statement_addressee = '',
      c_zip = '',
    } = JSON.parse(filters);

    const clientsQuery = pgPromise.as.format(
      `
          SELECT 
            c.${dbRef.clients.id},
            c.${dbRef.clients.c_name},
            c.${dbRef.clients.c_number},
            c.${dbRef.clients.c_address_1},
            c.${dbRef.clients.c_address_2},
            c.${dbRef.clients.c_city},
            c.${dbRef.clients.c_state},
            c.${dbRef.clients.c_zip},
            c.${dbRef.clients.c_phone},
            c.${dbRef.clients.c_fax},
            COALESCE(pc.propcount, 0) as propcount,
            COALESCE(icount.titlescount, 0) as titlescount,
            COUNT(*) OVER() AS total_count
          FROM ${dbRef.table_names.clients} c
          LEFT JOIN (
            SELECT 
              p.${dbRef.properties.p_number}, 
              COUNT(*) AS propcount 
            FROM ${dbRef.table_names.properties} p
            GROUP BY p.${dbRef.properties.p_number}
          ) pc ON pc.${dbRef.properties.p_number} = c.${dbRef.clients.c_number}
          LEFT JOIN (
            SELECT 
              ${dbRef.insurance_titles.i_number}, 
              COUNT(*) AS titlescount 
            FROM ${dbRef.table_names.insurance_titles}
            GROUP BY ${dbRef.insurance_titles.i_number}
          ) icount ON icount.${dbRef.insurance_titles.i_number} = c.${
            dbRef.clients.c_number
          }
  
        WHERE 
          c.${dbRef.clients.id} IS NOT NULL
          ${c_name ? andEquals('c', dbRef.clients.c_name, '1') : ''}
          ${c_number ? andEquals('c', dbRef.clients.c_number, '2') : ''}
          ${c_city ? andEquals('c', dbRef.clients.c_city, '3') : ''}
          ${c_contact ? andEquals('c', dbRef.clients.c_contact, '4') : ''}
          ${c_email ? andEquals('c', dbRef.clients.c_email, '5') : ''}
          ${c_fax ? andEquals('c', dbRef.clients.c_fax, '6') : ''}
          ${c_phone ? andEquals('c', dbRef.clients.c_phone, '7') : ''}
          ${c_status ? andEquals('c', dbRef.clients.c_status, '8') : ''}
          ${c_state ? andEquals('c', dbRef.clients.c_state, '9') : ''}
          ${
            c_statement_addressee
              ? andEquals('c', dbRef.clients.c_statement_addressee, '10')
              : ''
          }
          ${c_zip ? andEquals('c', dbRef.clients.c_zip, '11') : ''}
        ORDER BY 
          c.${dbRef.clients.c_name}
        OFFSET ${pageOffset} 
        LIMIT ${pageSize};
      `,
      [
        c_name,
        c_number,
        c_city,
        c_contact,
        c_email,
        c_fax,
        c_phone,
        c_status,
        c_state,
        c_statement_addressee,
        c_zip,
      ],
    );

    const clientsResults = JSON.parse(
      JSON.stringify((await conn.query(clientsQuery)).rows),
    );

    const totalRecords =
      clientsResults.length === 0 ? 0 : Number(clientsResults[0].total_count);

    return {
      clients: clientsResults,
      totalRecords,
      pageSize,
    };
  } catch (e) {
    console.log('Unable to fetch clients: ', e);
    return {};
  }
}
