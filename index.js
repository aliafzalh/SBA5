import express from 'express';
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.json())


// app.post(`/submit`, (req, res) => {
//     console.log(req.body)
//     res.send(`Form submitted`)
// })





app.listen(PORT, ()=> {
    console.log(`Server is runnoing on port: ${PORT}`)
})