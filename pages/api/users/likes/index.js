import pool from "@/lib/db";

export default async function handler (req, res) {
    try {
        if(req.method === 'PUT') {
            const db_res_1 = await pool.query("SELECT * FROM user_likes WHERE user_1_id = $1 AND user_2_id = $2;", [req.body.user_1_id, req.body.user_2_id]);
            const db_res_2 = await pool.query("SELECT * FROM user_likes WHERE user_1_id = $1 AND user_2_id = $2", [req.body.user_2_id, req.body.user_1_id]);
            if(db_res_1.rowCount + db_res_2.rowCount === 2 ) {
                res.status(200).send('Users have matched!')
                console.log('users have matched!')
            } else {
                res.status(300).send('No match was found for both users')
                console.log('no match found between users')
            }
        }
        if(req.method === 'POST') {
            const db_res = await pool.query("SELECT * FROM user_likes WHERE user_1_id = $1 AND user_2_id = $2", [req.body.user_1_id, req.body.user_2_id]);
            if (db_res.rowCount > 0) {
                res.status(200).send('Row already exists. No need for duplication')
            } else {
                const db_res = await pool.query("INSERT INTO user_likes VALUES($1, $2)", [req.body.user_1_id, req.body.user_2_id])
                res.status(201).send()
            }            
        }
    } catch (err) {
        console.log(err);
    }
}