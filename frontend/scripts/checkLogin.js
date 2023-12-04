function redirectToLoginIfNoUsername() {
    const username = localStorage.getItem('Username');
    if (!username) { window.location.href = "../templates/login.html"; }
}

redirectToLoginIfNoUsername();