import formidable from "formidable";
const fs = require('fs');

export const config = {
    api: {
       bodyParser: false,
    }
};

export default async function handler(req, res)  {
    const form = formidable();
    form.uploadDir = `${__dirname}/public/userImages`;
    

    form.parse(req, async (err, fields, files) => {
        if(err) {
            console.log(err)
        }
        await fs.renameSync(`/Users/jorimsoika/Documents/Coding-Projects/nextjs/dating-app/public/profileImages`, `/Users/jorimsoika/Documents/Coding-Projects/nextjs/dating-app/public/profileImages`)
    })
    


}