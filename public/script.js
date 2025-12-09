// LOGIN
async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById("status").innerText = data.message;
    if (data.success) window.location.href = "blog.html";
}

// POST MESSAGE
async function postMessage() {
    let content = document.getElementById("content").value;

    const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });

    const data = await res.json();
    if (data.success) loadPosts();
}

// LOAD POSTS
async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();

    const container = document.getElementById("posts");
    if (!container) return;

    container.innerHTML = data
        .map(p => `<div class='post'><b>${p.username}</b> (${p.date})<br>${p.content}</div>`)
        .join("");
}

// Auto-load posts on blog page
if (window.location.pathname.endsWith("blog.html")) loadPosts();
