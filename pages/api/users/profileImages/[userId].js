import pool from "@/lib/db"

export default async function handler(req, res)  {
    const {userId} = req.query

    try {
        const db_res = await pool.query("SELECT image FROM users WHERE id = $1", [userId])
        res.status(200).send(db_res.rows[0]);
    } catch (err) {
        console.log(err)
    }

}