import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new pg.pool (
   {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    datbase: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
   }
);

export const query  = (text, params)  => pool.query(text, params)