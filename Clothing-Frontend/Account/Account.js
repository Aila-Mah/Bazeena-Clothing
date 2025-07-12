const token = localStorage.getItem('token');

if (!token) {
  // Not logged in → redirect to login
  window.location.href = '../Login/Login.html';
}

async function getProfile() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Unauthorized');
    }

    const data = await res.json();
    document.getElementById('user-name').textContent = data.name;
    document.getElementById('user-email').textContent = data.email;
  } catch (err) {
    console.error(err);
    window.location.href = '../Auth/Login/Login.html';
  }
}

getProfile();

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '../Auth/Login/Login.html';
});

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
  
      // Remove active class from all buttons and contents
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.querySelector(`.tab-content[data-section="${tab}"]`).classList.add('active');
    });
  });
  