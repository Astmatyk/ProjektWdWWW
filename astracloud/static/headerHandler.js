const loginBtn = document.getElementById('loginHeaderAction');
const registerBtn = document.getElementById('registerHeaderAction');
const logoutBtn = document.getElementById('logoutHeaderAction');
const h_token = localStorage.getItem('authToken');

//handling wizualny przyciskow logowania
if (h_token) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
}
