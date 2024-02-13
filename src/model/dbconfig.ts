const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

let conn: any;

export type DBCredentials = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};

export async function connectToDB(creds: DBCredentials) {
  try {
    const { host, port, password, user, database } = creds;

    // Close existing connection pool if it exists
    if (conn) {
      await conn.end();
      conn = null;
    }

    conn = new Pool({
      user,
      password,
      host,
      port,
      database,
    });

    await conn.query('SELECT 1');

    return true;
  } catch (error) {
    return false;
  }
}

export async function checkConnection() {
  try {
    await conn.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

export async function getConn() {
  if (!conn) {
    throw new Error('Connection not yet established');
  }
  return conn;
}
