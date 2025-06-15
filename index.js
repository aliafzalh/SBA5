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

//Custom middleware
function logRequest(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}
app.use(logRequest);

//middleware 2
function passwordCheck(req, res, next) {
    const password = req.body["password"];
    if(password === "12345"){
        req.userIsAuthorised = true;
    }else {
        req.userIsAuthorised = false}
    next();
}

app.get(`/`, (req, res) =>{
    console.log(__dirname + "/index.html")
    res.sendFile(__dirname + "/index.html")
})

// Form submission route (protected)
app.post("/submit", passwordCheck, (req, res) => {
  if (req.userIsAuthorised) {
    res.send("Welcome authorized user.");
  } else {
    res.send("Access denied.");
  }
});

app.get("/crash", (req, res) => {
    // res.send(crash)});
    throw new Error("Server crash!");
})






app.listen(PORT, ()=> {
    console.log(`Server is runnoing on port: ${PORT}`)
})