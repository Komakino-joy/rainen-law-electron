import { dbRef } from '../../constants/dbRefs';
import pgPromise from 'pg-promise';
import { getConn } from '../dbconfig';

type OwnProps = { startDate: string; endDate: string; p_status: string };

export async function postPropertyReport(payload: OwnProps) {
  const { startDate, endDate, p_status } = payload;
  try {
    const conn = await getConn();
    const propertiesReportQuery = pgPromise.as.format(
      `
            SELECT 
              p.${dbRef.properties.p_input_date}, 
              COALESCE(p.${dbRef.properties.p_lot}, '0') as p_lot, 
              p.${dbRef.properties.p_street}, 
              p.${dbRef.properties.p_city}, 
              city.${dbRef.city.county} AS county_code, 
              cnt.${dbRef.counties.county}  AS county_name,
              p.${dbRef.properties.p_comp_ref}, 
              p.${dbRef.properties.p_number}, 
              c.${dbRef.clients.c_name}, 
              p.${dbRef.properties.p_type}, 
              p.${dbRef.properties.p_assign}, 
              p.${dbRef.properties.p_status}
            FROM ${dbRef.table_names.properties} p 
              LEFT JOIN ${dbRef.table_names.clients} c ON p.${dbRef.properties.p_number} = c.${dbRef.clients.c_number}
              LEFT JOIN ${dbRef.table_names.examiners} e1 ON p.${dbRef.properties.p_assign} = e1.${dbRef.examiners.code} 
              LEFT JOIN ${dbRef.table_names.city} ON p.${dbRef.properties.p_city} = city.${dbRef.city.city}
              LEFT JOIN ${dbRef.table_names.counties} cnt ON cnt.${dbRef.counties.code} = city.${dbRef.city.county}
            WHERE p.${dbRef.properties.p_input_date} BETWEEN DATE($1) AND DATE($2)
            AND LOWER(p.${dbRef.properties.p_status}) LIKE '%' || LOWER($3) || '%';
        `,
      [startDate, endDate, p_status],
    );

    const reportResults = (await conn.query(propertiesReportQuery)).rows;

    return {
      status: 'success',
      message: '',
      data: reportResults,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch properties report.',
    };
  }
}
