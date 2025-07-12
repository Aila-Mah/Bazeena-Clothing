const form = document.getElementById('signup-form');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // ✅ Validate name: letters only
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    message.style.color = 'red';
    message.textContent = 'Name must contain letters and spaces only.';
    return;
  }

  // ✅ Validate password length
  if (password.length < 6) {
    message.style.color = 'red';
    message.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  // ✅ Validate password: must contain at least one letter and one number
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    message.style.color = 'red';
    message.textContent = 'Password must include at least one letter and one number.';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      message.style.color = 'red';
      message.textContent = data.msg || 'Error during signup';
      return;
    }
    
    message.style.color = 'green';
    message.textContent = 'Registered successfully! You can now log in.';
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Server error';
    console.error('Signup error:', err);
  }
});
