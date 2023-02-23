import { Pool } from "pg";

const pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
})

export default pool;