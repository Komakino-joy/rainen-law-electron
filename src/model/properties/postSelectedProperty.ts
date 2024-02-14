import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

export async function postSelectedProperty(propertyId: string) {
  try {
    const conn = await getConn();
    const propertiesQuery = pgPromise.as.format(
      `
          SELECT 
            p.*, 
            c.${dbRef.clients.c_name},  
            c.${dbRef.clients.c_number},
            b.${dbRef.buyer_seller.seller_1},
            b.${dbRef.buyer_seller.seller_2},
            b.${dbRef.buyer_seller.seller_3},
            b.${dbRef.buyer_seller.seller_4},
            b.${dbRef.buyer_seller.buyer_1},
            b.${dbRef.buyer_seller.buyer_2}
          FROM ${dbRef.table_names.properties} p
          LEFT JOIN ${dbRef.table_names.clients} c
            ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
          LEFT JOIN ${dbRef.table_names.buyer_seller} b 
            ON b.${dbRef.buyer_seller.p_comp_ref} = p.${dbRef.properties.p_comp_ref}
          WHERE p.${dbRef.properties.id} = $1
          ;
        `,
      [propertyId],
    );

    const propertiesResults = (await conn.query(propertiesQuery)).rows[0];
    return propertiesResults;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch selected property',
    };
  }
}
