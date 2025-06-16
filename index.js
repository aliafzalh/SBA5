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
app.use(bodyParser.json());


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

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).send("Something went wrong.");
});

// function readData(fileName) {
//   const data = fs.readFileSync(`./data/${fileName}`, "utf-8");
//   return JSON.parse(data);
// }

// // GET all users
// app.get("/users", (req, res) => {
//   const users = readData("users.json");
//   res.json(users);
// });

// // GET all posts
// app.get("/posts", (req, res) => {
//   const posts = readData("posts.json");
//   res.json(posts);
// });

// // GET all comments
// app.get("/comments", (req, res) => {
//   const comments = readData("comments.json");
//   res.json(comments);
// });



const users = [];
const posts = [];
const comments = [];

app.post(`/users`, (req, res) =>{
    const {name, email} = req.body
    if (!name || !email){
        return res.status(400).json({error: "Name and email are required"})

    }
    const newUser = {id: users.length +1, name, email}
        users.push(newUser)
        res.status(201).json(newUser)

})

app.post("/posts", (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res.status(400).json({ error: "Title, content, and userId are required" });
  }
  const newPost = { id: posts.length + 1, title, content, userId };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.post("/comments", (req, res) => {
  const { postId, text, userId } = req.body;
  if (!postId || !text || !userId) {
    return res.status(400).json({ error: "postId, text, and userId are required" });
  }
  const newComment = { id: comments.length + 1, postId, text, userId };
  comments.push(newComment);
  res.status(201).json(newComment);
});


app.get("/users", (req, res) => res.json(users));
app.get("/posts", (req, res) => res.json(posts));
app.get("/comments", (req, res) => res.json(comments));





app.listen(PORT, ()=> {
    console.log(`Server is runnoing on port: ${PORT}`)
})