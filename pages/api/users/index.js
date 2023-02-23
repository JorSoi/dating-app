import pool from "@/lib/db";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler (req, res) {
    const session = await getServerSession(req, res, authOptions)
    try {
        if (req.method === 'GET') {
            const db_res = await pool.query("SELECT id, name, age, image, bio, user_verified FROM users WHERE id != $1 LIMIT 20", [session.user.id]);
            res.status(200).json(db_res.rows)
        }
    } catch (err) {
        console.log(err)
    }
}