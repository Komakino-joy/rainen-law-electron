import { Property } from '~/contracts';

const { dbRef } = require('../../constants/dbRefs');
const pgPromise = require('pg-promise');
const { getConn } = require('../dbconfig');

export async function postUpdateProperty(payload: Property) {
  const {
    clientName,
    p_city,
    p_street,
    p_lot,
    p_condo,
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
    id,
    username,
  } = payload;

  try {
    const conn = await getConn();
    await conn.query('BEGIN');

    // We need to get the Client Number from our DB since there is no reference to it in the properties table
    const clientIDQuery =
      'SELECT cm.c_number FROM ${dbRefs.table_names.clients} cm WHERE cm.c_name = ($1)';
    const clientIdResponse = await conn.query(clientIDQuery, [clientName]);

    const updateBuySellQuery = pgPromise.as.format(
      `
        UPDATE ${dbRef.table_names.buyer_seller} bs
        SET 
          ${dbRef.buyer_seller.seller_1}=$1,
          ${dbRef.buyer_seller.seller_2}=$2,
          ${dbRef.buyer_seller.seller_3}=$3,
          ${dbRef.buyer_seller.seller_4}=$4,
          ${dbRef.buyer_seller.buyer_1}=$5,
          ${dbRef.buyer_seller.buyer_2}=$6
        
        WHERE bs.${dbRef.buyer_seller.p_comp_ref} = $7

          RETURNING *
        ;
      `,
      [
        seller_1,
        seller_2,
        seller_3,
        seller_4,
        buyer_1,
        buyer_2,
        Number(p_comp_ref),
      ],
    );

    const updatePropertyQuery = pgPromise.as.format(
      `
          UPDATE ${dbRef.table_names.properties} pm
          SET
            ${dbRef.properties.p_input_date} = $1,
            ${dbRef.properties.p_city} = $2,
            ${dbRef.properties.p_street} = $3,
            ${dbRef.properties.p_lot} = $4,
            ${dbRef.properties.p_condo} = $5,
            ${dbRef.properties.p_unit} = $6,
            ${dbRef.properties.p_book_1} = $7,
            ${dbRef.properties.p_book_2} = $8,
            ${dbRef.properties.p_page_1} = $9,
            ${dbRef.properties.p_page_2} = $10,
            ${dbRef.properties.p_cert_1} = $11,
            ${dbRef.properties.p_number} = $12,
            ${dbRef.properties.p_requester} = $13,
            ${dbRef.properties.p_file} = $14, 
            ${dbRef.properties.p_type} = $15,
            ${dbRef.properties.p_status} = $16,
            ${dbRef.properties.p_assign} = $17,
            ${dbRef.properties.p_comp_ref} = $18,
            ${dbRef.properties.p_instructions} = $19,
            ${dbRef.properties.c_file} = $20,
            ${dbRef.properties.p_state} = $21,
            ${dbRef.properties.p_zip} = $22,
            ${dbRef.properties.p_request_date} = $23,
            ${dbRef.properties.p_closed_date} = $24,
            ${dbRef.properties.last_updated_by} = $25,
            ${dbRef.properties.last_updated} = $26 
          
          WHERE pm.${dbRef.properties.id} = $27

            RETURNING *
          ;
        `,
      [
        new Date(),
        p_city,
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
        Number(p_file) || null,
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
        new Date(),
        id,
      ],
    );

    const updatedBuySellRecord = await conn.query(updateBuySellQuery);
    const updatedPropertyRecord = await conn.query(updatePropertyQuery);
    await conn.query('COMMIT');

    return {
      updatedRecord: {
        ...updatedPropertyRecord.rows[0],
        ...updatedBuySellRecord.rows[0],
      },
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
