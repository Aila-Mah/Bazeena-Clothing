const form = document.getElementById('login-form');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      message.style.color = 'red';
      message.textContent = data.msg || 'Error during login';
      return;
    }
    
    message.style.color = 'green';
    message.textContent = 'Login successful! Token: ' + data.token;
    
    //store token
    localStorage.setItem('token', data.token);
    window.location.href = '../../Home/Home.html';


  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Server error';
  }
});
