import pool from "@/lib/db";

export default async function handler(req, res)  {

    try {
        if (req.method === 'GET') {
            const db_res = await pool.query("UPDATE users SET user_verified = true WHERE id = $1", [req.query.userId]);
            res.status(200).send()
        }
    } catch (err) {
        console.log(err)
    }


}