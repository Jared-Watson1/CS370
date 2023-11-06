// Dawit Comment: We no longer need this block of code. 


function login() {
  var usernameField = document.getElementById("username");
  var passwordField = document.getElementById("password");
  var username = usernameField.value;
  var password = passwordField.value;

  if (!username.endsWith("@emory.edu")) {
    alert("Must have an @emory.edu email");
    usernameField.value = "";
    passwordField.value = "";
    usernameField.focus(); // put focus back on the username field
  } else {
    alert("Login Successful!");
    window.location.href = "../templates/task.html"; // take you to main page after success
  }
}

// When the user hits enter and they're inside of the form, it submits the form.
document
  .getElementById("signupForm")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });
