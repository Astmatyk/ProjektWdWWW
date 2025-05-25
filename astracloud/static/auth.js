const token = localStorage.getItem("authToken");
const expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
const now = Date.now();
const path = window.location.pathname;

const isValid = token && expiry && now < expiry;

if (path === "logout") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "login";
    }

if (isValid) {
    if (path === "login" || path === "register") {
        window.location.href = "account";
    }
} else {
    if (path === "account") {
        window.location.href = "accountfail";
    }
}