import { dbRef } from '../../constants/dbRefs';
import { getConn } from '../dbconfig';

export async function getNewCompRef() {
  try {
    const conn = await getConn();
    const newCompRefQuery = `
          SELECT MAX(p.${dbRef.properties.p_comp_ref}) + 1 AS "p_comp_ref"
          FROM ${dbRef.table_names.properties} p;
        `;
    const propertiesResults = (await conn.query(newCompRefQuery)).rows;
    return propertiesResults[0].p_comp_ref;
  } catch (error) {
    console.log(error);
    return { message: 'Failed to get new Comp Ref Number' };
  }
}
