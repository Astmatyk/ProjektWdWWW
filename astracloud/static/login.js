loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formLogin = document.getElementById("loginData").value.trim();
    const formPassword = document.getElementById("password").value;

    console.log("uwaga login event");
    // tego nie powinno byc w produkcji..
    //console.log("Login:", formLogin);
    //console.log("Password:", formPassword);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: formLogin, password: formPassword })
        });

        if(response.ok) {
            const data = await response.json();
            if (data.token) {
                const expiry = Date.now() + 60 * 60 * 1000;
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('tokenExpiry', expiry.toString());
                localStorage.setItem('user', formLogin);
                // do usunięcia - cookie jest zastępowany przez localStorage
                // document.cookie = `authToken=${data.token}; path=/; max-age=7200; SameSite=Strict`;
                console.log("Zalogowano, token:", data.token);
                window.location.href = "/account";
            } else {
                document.getElementById("jsCode").innerHTML = "Coś poszło nie tak, spróbuj ponownie.";
            }
        } else {
            document.getElementById("jsCode").innerHTML = "Sprawdź dane logowania.";
        }
    } catch (error) {
        document.getElementById("jsCode").innerHTML = "Sprawdź dane logowania.";
    }
});


