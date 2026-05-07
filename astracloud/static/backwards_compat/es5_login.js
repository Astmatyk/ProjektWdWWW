loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var formLogin = document.getElementById("loginData").value.trim();
    var formPassword = document.getElementById("password").value;

    console.log("uwaga login event");
    // tego nie powinno byc w produkcji..
    //console.log("Login:", formLogin);
    //console.log("Password:", formPassword);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    console.log(data);
                    if (data.token) {
                        var expiry = Date.now() + 2 * 24 * 60 * 60 * 1000;
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
                } catch (e) {
                    document.getElementById("jsCode").innerHTML = "Coś poszło nie tak, spróbuj ponownie.";
                }
            } else {
                document.getElementById("jsCode").innerHTML = "Sprawdź dane logowania.";
            }
        }
    };

    var payload = JSON.stringify({ login: formLogin, password: formPassword });
    xhr.send(payload);
});

