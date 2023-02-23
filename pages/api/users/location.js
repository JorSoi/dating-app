import pool from "@/lib/db";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler (req, res) {
    const session = await getServerSession(req, res, authOptions)
    try {
        if (req.method === 'PUT') {
            const db_res = await pool.query("UPDATE users SET location_city = $1 WHERE id = $2;", [req.body.city, session.user.id])
            res.status(204);
        }
    } catch (err) {
        console.log(err)
    }
}