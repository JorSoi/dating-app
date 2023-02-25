import pool from "@/lib/db";

export default async function handler (req, res) {
    try {
        if (req.method === 'GET') {
            const db_res = await pool.query("SELECT i.id, i.interest_emoji, i.interest_name FROM user_interests ui JOIN users u ON u.id = ui.user_id JOIN interests i ON i.id = ui.interest_id WHERE u.id = $1", [req.query.userId]);
            res.status(200).json(db_res.rows)
        }
        if (req.method === 'POST') {
            const db_res = await pool.query("INSERT INTO user_interests VALUES ($1, $2)", [req.query.userId, req.body.interestId]);
            res.status(200).json(db_res.rows)
            
        }
        if (req.method === 'DELETE') {
            const db_res = await pool.query("DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2;", [req.query.userId, req.body.interestId]);
            res.status(200).json(db_res.rows)
        }
    } catch (err) {
        console.log(err)
    }
}