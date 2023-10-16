async function forgotPassword() {
    const email = document.getElementById('username').value;
    try {
        const response = await fetch('/api/send_verification', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        });
        if (response.ok) {
            alert('Verification email sent. Please check your inbox.');
        } else {
            alert('Error sending email. Please try again later.');
        }
    } catch (error) {
        alert('Request failed. Please try again later.');
    }
}

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    login();
});

// /Users/xingyuzhai/Documents/GitHub/CS370/Backend/server.js