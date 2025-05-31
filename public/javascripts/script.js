document.addEventListener('DOMContentLoaded', function () {
  // Forgot password modal
  var forgotLink = document.querySelector('.link[href="#0"]');
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      $('#forgotPasswordModal').modal('show');
    });
  }

  // Login
  document.getElementById('login-btn').onclick = async function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    if (!email || !password) {
      errorDiv.textContent = 'Please enter email and password.';
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/games';
      } else {
        errorDiv.textContent = data.message || 'Login failed';
      }
    } catch (err) {
      errorDiv.textContent = 'Network error';
    }
  };

  // Signup
  document.getElementById('signup-btn').onclick = async function (e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorDiv = document.getElementById('signup-error');
    errorDiv.textContent = '';
    if (!name || !email || !password) {
      errorDiv.textContent = 'All fields required.';
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please log in.');
        document.getElementById('reg-log').checked = false;
      } else {
        errorDiv.textContent = data.message || 'Signup failed';
      }
    } catch (err) {
      errorDiv.textContent = 'Network error';
    }
  };
});