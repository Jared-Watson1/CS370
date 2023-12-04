// Define the base URL of the API

function valid_login() {
  var username = document.getElementById("username_auth").value;
  var passwordField = document.getElementById("password_auth").value;

  requestBody = { username: username, password: passwordField };

  console.log("Sending:", JSON.stringify(requestBody)); // Log the request payload

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      console.log("Received:", response); // Log the response object for debugging purposes

      if (!response.ok) {
        alert("Login unsuccessful!");
        throw new Error("Network response was not ok: " + response.statusText);
      } else {

        document.cookie = "username=" + username;
        localStorage.setItem('Username', username) // locally store username (persistant)
        window.location.href = "../templates/do_or_get.html"; // take you to main page after success
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error); // Log any error
      // alert("An error occurred while logining in");
    });
}

document.addEventListener("DOMContentLoaded", function() {

  loginForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { valid_login(); }
  });
});