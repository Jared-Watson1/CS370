// give me isVerified from emailVerification.js
const API_BASE_URL = "https://task-manager-0-94114aee724a.herokuapp.com/"

let email;
document.getElementById("registerButton").addEventListener("click", signup);


async function signup() {
  // console.log("Signup button clicked!"); // Add this line
  let password_length = 8;
  let usernameField = document.getElementById("username");
  let passwordField = document.getElementById("password");
  let password2Field = document.getElementById("password2");
  let phone_numberField = document.getElementById("phone_number");
  let emails = document.getElementById("email");
  email = emails.value; // updates global email var to be used for resendEmail
  let username = usernameField.value;
  let password = passwordField.value;
  let password2 = password2Field.value;
  let first_name = document.getElementById("first_name").value.trim();
  let last_name = document.getElementById("last_name").value.trim();
  let phone_number = phone_numberField.value.trim();
  let isEmailValid = false;

  if (password != password2) {
    alert("Passwords do not match. Please re-enter your passwords");
    passwordField.value = "";
    password2Field.value = "";
    passwordField.focus(); // put clicker back on password
  } else if (
    password.length < password_length ||
    password2.length < password_length
  ) {
    alert("Password is too short");
    passwordField.value = "";
    password2Field.value = "";
    passwordField.focus(); // put clicker back on password
  } else if (!email.endsWith("@emory.edu")) {
    alert("Must have an @emory.edu email");
    usernameField.value = "";
    passwordField.value = "";
    password2Field.value = "";
    usernameField.focus(); // put focus back on the username field
  } else if (phone_number.length < 10) {
    alert("Phone number is an invalid length.");
    phone_numberField.value = "";
    phone_numberField.focus();
  } else {
    alert(
      "Signup Successful!"
    );

    const tasData = {
      username: username,
      email: email,
      phone_number: phone_number,
      password: password,
      first_name: first_name,
      last_name: last_name,
    };
    
    
    let authCode = await sendEmailToUser(tasData);
    localStorage.setItem('code', authCode);

    document.cookie = "username=" + username;
    localStorage.setItem('Username'    , username);
    localStorage.setItem('email'       , email);
    localStorage.setItem('phone_number', phone_number);
    localStorage.setItem('password'    , password);
    localStorage.setItem('first_name'  , first_name);
    localStorage.setItem('last_name'   , last_name);
    window.location.href = "../templates/emailVerification.html";
  }
}

// Function to send a verification email
async function sendEmailToUser(data) {
  let authCode;
  // send the variable authCode to emailVerification.js
  
  try {
    let response = await fetch(`${API_BASE_URL}/verify_email`, { // send email
      method: 'POST',
      headers: { 
          "Content-Type": "application/json",
      },
      // body: JSON.stringify({ email: email }),
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      let responseData = await response.json();
      authCode = responseData.auth_code;
      return authCode
    } else { 
      console.error('Error sending email:', response.status); 
      return null;
    }
  } catch (error) {
    console.log("error parsing JSON:", error);
    return null;
  }
}

// When the user hits enter and they're inside of the form, it submits the form.
document.addEventListener("DOMContentLoaded", function() {
  
  signupForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { signup(); }
  });
});

