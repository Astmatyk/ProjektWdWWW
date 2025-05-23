registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formLogin = document.getElementById("loginData").value.trim();
    const formEmail = document.getElementById("email").value.trim();
    const formPassword = document.getElementById("password").value;
    const formPasswordRepeat = document.getElementById("password1").value;

    console.log("Dostałem dane");
    console.log("Login:", formLogin);
    console.log("E-mail:", formEmail);
    console.log("Password:", formPassword);
    console.log("Password - repeat:", formPasswordRepeat);

});


/* //register.js

Pobranie danych
Walidacja powtarzanego hasła i reszty danych
Zwracanie stosownych komunikatów i np. czyszczenie pól hasłowych przy błędzie, albo sprawdzanie na bieżąco czy błąd nie występuje, a także

*/