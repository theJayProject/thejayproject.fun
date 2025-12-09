const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(session({ secret: "secret123", resave: false, saveUninitialized: true }));

// Demo users
const USERS = {
    "test": "1234",
    "admin": "admin"
};

let posts = [];

// LOGIN
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (USERS[username] && USERS[username] === password) {
        req.session.loggedIn = true;
        req.session.username = username;
        return res.json({ success: true, message: "Login successful" });
    }
    res.json({ success: false, message: "Invalid username or password" });
});

// GET POSTS
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// ADD POST
app.post("/api/post", (req, res) => {
    if (!req.session.loggedIn) return res.json({ success: false, message: "Not logged in" });

    const { content } = req.body;
    const date = new Date().toLocaleString();

    posts.unshift({
        username: req.session.username,
        content,
        date
    });

    res.json({ success: true });
});

app.listen(3000, () => console.log("Backend running http://localhost:3000"));
