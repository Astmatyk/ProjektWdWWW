loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formLogin = document.getElementById("loginData").value.trim();
    const formPassword = document.getElementById("password").value;

    console.log("Dostałem dane");
    console.log("Login:", formLogin);
    console.log("Password:", formPassword);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: formLogin, password: formPassword })
        });

        if (!response.ok) {
            throw new Error('Błąd sieci lub logowania');
        }

        const data = await response.json();

        if (data.token) {
            const expiry = Date.now() + 60 * 60 * 1000;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('tokenExpiry', expiry.toString());
            console.log("Zalogowano, token:", data.token);
            window.location.href = "/account.html";
        } else {
            document.getElementById("jsCode").innerHTML = "Coś poszło nie tak, spróbuj ponownie.";
        }

    } catch (error) {
        console.error("Błąd:", error);
        document.getElementById("jsCode").innerHTML = "Coś poszło nie tak, spróbuj ponownie.";
    }
});


