import pg from "pg";

const { Pool } = pg;

const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "timetracker",
  user: "postgres",
  password: "123456789",
};
const pool = new Pool(dbConfig);

export const query = (text: string, params?: string[]) => {
  return pool.query(text, params);
};
