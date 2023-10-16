async function forgotPassword() {
    let emailField = document.getElementById('username');
    let email = emailField.value;

    if (!email.endsWith("@emory.edu")) {
        alert("Must have an @emory.edu email");
        emailField.value = "";
    } else {
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
}

document.getElementById("signupForm").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        forgotPassword(); }
});

// /Users/xingyuzhai/Documents/GitHub/CS370/Backend/server.js