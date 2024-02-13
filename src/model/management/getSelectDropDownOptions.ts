import { getConn } from '../dbconfig';

export async function getSelectDropDownOptions() {
  try {
    const conn = await getConn();

    const propertyTypesQuery = `SELECT * FROM prop_types;`;
    const propertyTypesResult = await conn.query(propertyTypesQuery);

    const propertyStatusQuery = `SELECT * FROM prop_status;`;
    const propertyStatusResult = await conn.query(propertyStatusQuery);

    const clientStatusQuery = `SELECT * FROM client_status;`;
    const clientStatusResult = await conn.query(clientStatusQuery);

    const allCitiesQuery = `SELECT * FROM cities;`;
    const allCitiesResult = await conn.query(allCitiesQuery);

    const distinctCitiesQuery = `SELECT DISTINCT(city) FROM cities;`;
    const distinctCitiesResult = await conn.query(distinctCitiesQuery);

    const distinctCountiesQuery = `SELECT DISTINCT(county) FROM cities;`;
    const distinctCountiesResult = await conn.query(distinctCountiesQuery);

    return {
      propertyTypeList: propertyTypesResult.rows,
      propertyStatusList: propertyStatusResult.rows,
      clientStatusList: clientStatusResult.rows,
      allCitiesList: allCitiesResult.rows,
      distinctCitiesList: distinctCitiesResult.rows,
      distinctCountiesList: distinctCountiesResult.rows,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch select drop down options.',
    };
  }
}
