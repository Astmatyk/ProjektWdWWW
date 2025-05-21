const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', loginFunc);

function loginFunc(e) {
    
    e.preventDefault(); // 🔒 Stop form from submitting
    console.log("Dostałem dane");
    const formLogin = document.getElementById("loginData").value.trim();
    const formPassword = document.getElementById("password").value;

    console.log("Login:", formLogin);
    console.log("Password:", formPassword);
}