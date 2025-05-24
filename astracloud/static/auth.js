const token = localStorage.getItem("loginToken");
    const expiry = parseInt(localStorage.getItem("tokenExpiry"),10);
    const now = Date.now();

    const isValid = token && expiry && now < expiry;

    if (!isValid){
        window.location.href = "accountNoEntry.html";
    }