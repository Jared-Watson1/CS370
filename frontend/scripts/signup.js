function signup() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // will actually be functional in the future.
    alert("Signup Successful!\nUsername: " + username + "\nPassword: " + password);
    window.location.href = "task.html"; // take you to main page after success
}
