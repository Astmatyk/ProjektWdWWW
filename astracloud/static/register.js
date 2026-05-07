registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formLogin = document.getElementById("login").value.trim();
    const formEmail = document.getElementById("email").value.trim();
    const formPassword = document.getElementById("password").value;
    const formPasswordRepeat = document.getElementById("password1").value;

    console.log("Dostałem dane");
    console.log("Login:", formLogin);
    console.log("E-mail:", formEmail);
    console.log("Password:", formPassword);
    console.log("Password - repeat:", formPasswordRepeat);

    if(formPassword === formPasswordRepeat){
        document.getElementById("jsCode").innerHTML = "";
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formEmail, login: formLogin, password: formPassword })
            });
            const data = await response.json();
            if (response.ok) {
                document.getElementById("jsCode").innerHTML = "Zarejestrowano pomyślnie!";
            }
            else {
                document.getElementById("jsCode").innerHTML = data.error;
            }
        } catch (error) {
            document.getElementById("jsCode").innerHTML = "Błąd rejestracji!";
        }
    }
    else{
        document.getElementById("jsCode").innerHTML = "Hasła nie są takie same!";
    }

});
