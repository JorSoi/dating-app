import pool from "@/lib/db";

export default async function handler (req, res) {
    const { likeId } = req.query;
    try {
        if(req.method === 'POST') {
            const db_res = await pool.query("SELECT * FROM user_likes WHERE user_1_id = $1 AND user_2_id = $2", [req.body.user_1_id, req.body.user_2_id]);
            if (db_res.rowCount > 0) {
                res.status(200).send('Row already exists. No need for duplication')
            } else {
                const db_res = await pool.query("INSERT INTO user_likes VALUES($1, $2)", [req.body.user_1_id, req.body.user_2_id])
                res.status(204)
            }            
        }
       
    } catch (err) {
        console.log(err)
    }
    
   
}