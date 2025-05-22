loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formLogin = document.getElementById("loginData").value.trim();
    const formPassword = document.getElementById("password").value;

    console.log("Dostałem dane");
    console.log("Login:", formLogin);
    console.log("Password:", formPassword);

});


/* //register.js

Pobranie danych
Walidacja powtarzanego hasła i reszty danych
Zwracanie stosownych komunikatów i np. czyszczenie pól hasłowych przy błędzie, albo sprawdzanie na bieżąco czy błąd nie występuje, a także

*/