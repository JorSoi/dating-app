import multer from "multer";
import pool from "@/lib/db";
import nc from "next-connect"
const path = require('path');

export const config = {
    api: {
       bodyParser: false,
       sizeLimit: '200mb' 
    }
};

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public", "userImages"));
      },
      filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
      },
    }),
  });

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(upload.single('image'))
  .post(async (req, res) => {
    try {
        console.log(req.file)
        const db_res = await pool.query('UPDATE users SET image = $1 WHERE id = $2', [req.file.filename, req.body.userId]);
        res.status(201).json({body: req.body});
    } catch (err) {
        console.log(err);
    }
  })

  export default handler;