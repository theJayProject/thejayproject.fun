// ===== LOGIN =====
const USERS = { test: "1234", admin: "admin" };

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

// ===== BLOG FUNCTIONS =====

// Wrap selected text for bold/italic/underline
function wrapText(marker) {
    const textarea = document.getElementById("content");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.slice(0, start) + marker + text.slice(start, end) + marker + text.slice(end);
}

// Add image via URL
function addImage() {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const textarea = document.getElementById("content");
    textarea.value += `\n![image](${url})\n`;
}

// Format markdown-like content into HTML
function formatContent(content) {
    content = content.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");   // bold
    content = content.replace(/\*(.*?)\*/g, "<i>$1</i>");       // italic
    content = content.replace(/__(.*?)__/g, "<u>$1</u>");       // underline
    content = content.replace(/!\[image\]\((.*?)\)/g, "<br><img src='$1'><br>"); // images
    return content;
}

// Post message
function postMessage() {
    const content = document.getElementById("content").value;
    const username = localStorage.getItem("loggedInUser");
    if (!username) return alert("Not logged in");

    if (!content.trim()) return alert("Cannot post empty content");

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const date = new Date().toLocaleString();
    posts.unshift({ username, content, date });
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("content").value = "";
    loadPosts();
}

// Load posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const container = document.getElementById("posts");
    if (!container) return;

    container.innerHTML = posts
        .map(p => `<div class='post'><b>${p.username}</b> (${p.date})<br>${formatContent(p.content)}</div>`)
        .join("");
}

// Auto-load posts when on blog page
if (window.location.pathname.endsWith("blog.html")) loadPosts();
