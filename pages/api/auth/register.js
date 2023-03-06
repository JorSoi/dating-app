import pool from "@/lib/db";
import { config } from "../upload";

export default async function handler(req, res)  {

    try {
        if (req.method === 'POST') {
            const checkForUser = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
            if(checkForUser.rowCount > 0) {
                res.status(200).json({"alreadyRegistered": true});
            } else {
                await pool.query("INSERT INTO users (id, email, password) VALUES (DEFAULT, $1, $2)", [req.body.email, req.body.password]);
                res.status(200).json({"alreadyRegistered": false});
            }
        }
       
    } catch (err) {
        console.log(err)
    }


}