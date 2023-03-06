import pool from "@/lib/db"

export default async function handler (req, res) {
    try {
        if (req.method === 'PUT') {
            const db_res = await pool.query("UPDATE users SET name = $1, bio = $2, age = $3, gender = $4 WHERE id = $5", [req.body.name, req.body.bio, req.body.age, req.body.gender, req.query.userId])
            res.status(200).send('Successfully updated user data.')
        }
    } catch (err) {
        console.log(err)
    }
}