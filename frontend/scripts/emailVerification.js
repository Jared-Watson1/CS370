const API_BASE_URL = "https://task-manager-0-94114aee724a.herokuapp.com/"


async function verifyEmail(enteredCode) {
    let authCode = localStorage.getItem('code');
    let tempData = {
      username:     localStorage.getItem('username'),
      email:        localStorage.getItem('email'),
      phone_number: localStorage.getItem('phone_number'),
      password:     localStorage.getItem('password'),
      first_name:   localStorage.getItem('first_name'),
      last_name:    localStorage.getItem('last_name')
    }
    
    if (authCode && authCode === enteredCode) { 
      if (tempData) { postUserToApi(tempData); }
      // remove all sensitive items from localstorage
      localStorage.removeItem('code')
      
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('phone_number')
      localStorage.removeItem('password')
      localStorage.removeItem('first_name')
      localStorage.removeItem('last_name')
      alert("Email Successfully Verified!")
      window.location.href = "../templates/do_or_get.html";
    } else {
      alert('The entered code was not correct!');
    }
}

// Function to add a user
async function postUserToApi(data) {
    const requestBody = data;
  
    console.log("Sending:", JSON.stringify(requestBody)); // Log the request payload
  
    try {
      let response = await fetch("/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
    
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      let responseData = await response.json();
      console.log("Data: ", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  }


window.onload = function() {
    let verifCode = document.getElementById("verifyEmailCode");
    if (verifCode) {
        verifCode.addEventListener("click", function () {

            let enteredCode = document.getElementById("verificationCode").value
            if (enteredCode.length === 6) { verifyEmail(enteredCode); }
            else { alert("Please enter 6 digits."); }
        });
    }
};