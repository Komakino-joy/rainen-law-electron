import { Property } from '~/contracts';
const { dbRef } = require('../../constants/dbRefs');
const pgPromise = require('pg-promise');
const { getConn } = require('../dbconfig');

export async function postInsertProperty(payload: Property) {
  const {
    clientName,
    p_city,
    p_street,
    p_lot,
    p_condo,
    p_county,
    p_unit,
    p_book_1,
    p_book_2,
    p_page_1,
    p_page_2,
    p_cert_1,
    p_requester,
    p_file,
    p_type,
    p_status,
    p_assign,
    p_comp_ref,
    p_instructions,
    c_file,
    p_state,
    p_zip,
    buyer_1,
    buyer_2,
    seller_1,
    seller_2,
    seller_3,
    seller_4,
    p_request_date,
    p_closed_date,
    username,
  } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    // We need to get the Client Number from our DB since there is no reference to it in the properties table
    const clientIDQuery = `SELECT cm.c_number FROM ${dbRef.table_names.clients} cm WHERE cm.c_name = ($1)`;
    const clientIdResponse = await conn.query(clientIDQuery, [clientName]);

    const addNewBuySellRecord = pgPromise.as.format(
      `
          INSERT INTO ${dbRef.table_names.buyer_seller}
          (
            ${dbRef.buyer_seller.p_comp_ref},
            ${dbRef.buyer_seller.seller_1},
            ${dbRef.buyer_seller.seller_2},
            ${dbRef.buyer_seller.seller_3},
            ${dbRef.buyer_seller.seller_4},
            ${dbRef.buyer_seller.buyer_1},
            ${dbRef.buyer_seller.buyer_2}
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)

            RETURNING *
          ;
        `,
      [
        Number(p_comp_ref) || null,
        seller_1,
        seller_2,
        seller_3,
        seller_4,
        buyer_1,
        buyer_2,
      ],
    );

    const addNewPropertyQuery = pgPromise.as.format(
      `
          INSERT INTO ${dbRef.table_names.properties}
          (
            ${dbRef.properties.p_input_date},
            ${dbRef.properties.p_city},
            ${dbRef.properties.p_county},
            ${dbRef.properties.p_street},
            ${dbRef.properties.p_lot},
            ${dbRef.properties.p_condo},
            ${dbRef.properties.p_unit},
            ${dbRef.properties.p_book_1},
            ${dbRef.properties.p_book_2},
            ${dbRef.properties.p_page_1},
            ${dbRef.properties.p_page_2},
            ${dbRef.properties.p_cert_1},
            ${dbRef.properties.p_number},
            ${dbRef.properties.p_requester},
            ${dbRef.properties.p_file},
            ${dbRef.properties.p_type},
            ${dbRef.properties.p_status},
            ${dbRef.properties.p_assign},
            ${dbRef.properties.p_comp_ref},
            ${dbRef.properties.p_instructions},
            ${dbRef.properties.c_file},
            ${dbRef.properties.p_state},
            ${dbRef.properties.p_zip},
            ${dbRef.properties.p_request_date},
            ${dbRef.properties.p_closed_date},
            ${dbRef.properties.created_by},
            ${dbRef.properties.last_updated_by},
            ${dbRef.properties.last_updated},
            ${dbRef.properties.created_at}
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 
            $22, $23, $24, $25, $26, $27, $28, $29)

            RETURNING *
          ;
        `,
      [
        new Date(),
        p_city,
        p_county,
        p_street,
        p_lot,
        p_condo,
        p_unit,
        p_book_1,
        p_book_2,
        p_page_1,
        p_page_2,
        p_cert_1,
        Number(clientIdResponse.rows[0].c_number),
        p_requester,
        p_file || null,
        p_type,
        p_status,
        p_assign,
        Number(p_comp_ref),
        p_instructions,
        c_file,
        p_state,
        p_zip,
        p_request_date === '' ? null : p_request_date,
        p_closed_date === '' ? null : p_closed_date,
        username,
        username,
        new Date(),
        new Date(),
      ],
    );

    await conn.query(addNewBuySellRecord);

    const newPropertyRecord = await conn.query(addNewPropertyQuery);
    await conn.query('COMMIT');

    return {
      newPropId: newPropertyRecord.rows[0].id,
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
