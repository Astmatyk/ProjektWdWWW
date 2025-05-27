const auth_token = localStorage.getItem("authToken");
const auth_expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
const auth_now = Date.now();
const auth_path = window.location.pathname;

// valid gdy mamy authtoken i gdy ten nie przeterminował się jeszcze
const isValid = auth_token && auth_expiry && auth_now < auth_expiry;

// usuwamy ciastko przy wylogowaniu
if (auth_path === "/logout") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

// skipujemy login i register
if (isValid) {
    console.log(auth_path);
    if (auth_path == "/login" || auth_path == "/register") {
        window.location.href = "/account";
    }
} else {
    if (auth_path === "/account") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("user");
        window.location.href = "/accountfail";
    }
}
