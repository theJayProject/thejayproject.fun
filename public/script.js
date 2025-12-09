// Demo user
const USERS = { test: "1234", admin: "admin" };

// LOGIN
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (USERS[username] && USERS[username] === password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "blog.html";
    } else {
        document.getElementById("status").innerText = "Invalid username or password";
    }
}

// POST MESSAGE
function postMessage() {
    const content = document.getElementById("content").value;
    const username = localStorage.getItem("loggedInUser");
    if (!username) return alert("Not logged in");

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");

    const date = new Date().toLocaleString();
    posts.unshift({ username, content, date });
    localStorage.setItem("posts", JSON.stringify(posts));
    document.getElementById("content").value = "";
    loadPosts();
}

// LOAD POSTS
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const container = document.getElementById("posts");
    if (!container) return;

    container.innerHTML = posts
        .map(p => `<div class='post'><b>${p.username}</b> (${p.date})<br>${p.content}</div>`)
        .join("");
}

// Auto-load posts on blog page
if (window.location.pathname.endsWith("blog.html")) loadPosts();
