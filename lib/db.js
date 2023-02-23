import { Pool } from "pg";

const pool = new Pool({
    host: 'localhost',
    database: 'datingapp_db',
    port: 5432
})

export default pool;