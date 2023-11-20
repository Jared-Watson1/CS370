let users;
let ratingsSum;
let numRatings;

async function getUserData() { // function to get user data to fill in profile
  let username = localStorage.getItem('Username');
  // console.log(username)

  let response = await fetch(`${API_BASE_URL}/get_info_by_user?username=${username}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
  });
  
  if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
  let data = await response.json();
  // console.log(data)

  document.querySelector(".fn").textContent = data.first_name;
  document.querySelector(".ln").textContent = data.last_name;
  document.querySelector(".em").textContent = data.email;
  document.querySelector(".pn").textContent = data.phone_number;
}

window.onload = function () {
  getUserData(); 
};  
const ratingsList = document.querySelector(".ratings-list");
const ratingMessage = document.getElementById("ratingMessage");

function displayStars(rating, maxStars = 5) {
  const fullStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star" style="color: gold; "></i></li>';
  const halfStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star-half-alt" style="color: gold; "></i></li>';
  const emptyStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star" style="color: #ddd; "></i></li>';

  const fullStarsCount = Math.floor(rating);
  const isHalfStar = rating - fullStarsCount >= 0.5;
  const emptyStarsCount = maxStars - fullStarsCount - (isHalfStar ? 1 : 0);

  let starsHTML = "";

  for (let i = 0; i < fullStarsCount; i++) starsHTML += fullStar;
  if (isHalfStar) starsHTML += halfStar;
  for (let i = 0; i < emptyStarsCount; i++) starsHTML += emptyStar;

  ratingsList.innerHTML = starsHTML;
}

if (numRatings < 3) {
  // You can adjust the threshold as required
  ratingMessage.textContent = "There are too few reviews to display a rating";
} else {
  ratingMessage.textContent = ""; // Clear the message
  const averageRating = ratingSum / numRatings;
  displayStars(averageRating);
}