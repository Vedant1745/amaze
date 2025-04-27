const backendUrl = "http://localhost:5000";

async function signup() {
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  const res = await fetch(`${backendUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (data.success) {
    alert('Signup successful! Please login now.');
    window.location.href = "login.html";  // Redirect to login page
  } else {
    alert(data.error);
  }
}

function goToLogin() {
  window.location.href = "login.html"; // Button to go to login
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.success) {
    alert('Login successful! Redirecting...');
    window.location.href = "https://404-cafe.vercel.app/";  // Redirect after login
  } else {
    alert(data.error);
  }
}
