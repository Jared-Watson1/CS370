function signup() {
    let password_length = 8
    var usernameField  = document.getElementById("username");
    var passwordField  = document.getElementById("password");
    var password2Field = document.getElementById("password2");
    var username  = usernameField.value;
    var password  = passwordField.value;
    var password2 = password2Field.value;

    if (password != password2) {
        alert("Passwords do not match. Please re-enter your passwords");
        passwordField.value  = "";
        password2Field.value = "";
        passwordField.focus(); // put clicker back on password
    } 
    else if (password.length < password_length || password2.length < password_length) {
        alert("Password is too short");
        passwordField.value  = "";
        password2Field.value = "";
        passwordField.focus(); // put clicker back on password
    } 
    else if (!username.endsWith("@emory.edu")) {
        alert("Must have an @emory.edu email");
        usernameField.value  = "";
        passwordField.value  = "";
        password2Field.value = "";
        usernameField.focus(); // put focus back on the username field
    }
    else {
        alert("Signup Successful!\nUsername: " + username + "\nPassword: " + password);
        window.location.href = "task.html"; // take you to main page after success
    }
}

// When the user hits enter and they're inside of the form, it submits the form. 
document.getElementById("signupForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        signup();
    }
});