import pool from "@/lib/db";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler (req, res) {
    const session = await getServerSession(req, res, authOptions)
    try {
        if (req.method === 'PUT') {
            const anyPreviousEntry = await pool.query("SELECT 1 FROM user_locations WHERE user_id = $1", [session.user.id])
            if (anyPreviousEntry.rowCount == 0) {
                await pool.query("INSERT INTO user_locations VALUES ($1, $2, $3, $4, $5)", [session.user.id, req.body.latitude, req.body.longitude, req.body.city, req.body.country]);
                res.status(204).send();  
            } else {
                await pool.query("UPDATE user_locations SET latitude = $1, longitude = $2, city = $3, country = $4 WHERE user_id = $5", [req.body.latitude, req.body.longitude, req.body.city, req.body.country, session.user.id]);
                res.status(204).send();
            }
        }
        if (req.method === 'GET') {
            const db_res = await pool.query("SELECT * FROM user_locations WHERE user_id = $1;", [session.user.id]);
            db_res.rowCount == 0 ? res.status(404).send('No location record found yet') : res.status(200).send(db_res.rows[0])
            
        }
    } catch (err) {
        console.log(err)
    }
}