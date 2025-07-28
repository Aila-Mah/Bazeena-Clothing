const token = localStorage.getItem('token');

if (!token) {
  // Not logged in → redirect to login
  window.location.href = '../Login/Login.html';
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
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
loadAddress(); 

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
    const section = document.querySelector(`.tab-content[data-section="${tab}"]`);
    section.classList.add('active');

    // If "My Orders" tab is clicked, load the orders
    if (tab === 'my-orders') {
      loadMyOrders();
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const tab = localStorage.getItem('activeTab');
  const success = localStorage.getItem('orderSuccess');

  if (tab) {
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tab) btn.classList.add('active');
    });

    document.querySelectorAll('.tab-content').forEach(section => {
      section.classList.remove('active');
      if (section.dataset.section === tab) section.classList.add('active');
    });

    // Load orders if returning to "my-orders"
    if (tab === 'my-orders') {
      loadMyOrders();
    }

    localStorage.removeItem('activeTab');
  }

  if (success === 'true') {
    showToast('Order placed successfully!', 'success');
    localStorage.removeItem('orderSuccess');
  }
});

document.getElementById('password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById('current-password').value.trim();
  const newPassword = document.getElementById('new-password').value.trim();

  if (!currentPassword || !newPassword) {
    return showToast('Please fill out all password fields.', 'error');
  }

  if (newPassword.length < 6) {
    return showToast('Password must be at least 6 characters.', 'error');
  }
  

  try {
    const res = await fetch('http://localhost:5000/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();

    if (!res.ok) {
      return showToast(data.msg || 'Password change failed.', 'error');
    }

    showToast('Password changed successfully!', 'success');
    document.getElementById('password-form').reset();
  } catch (err) {
    console.error('Error changing password:', err);
    showToast('Error updating password.', 'error');
  }
});

async function loadMyOrders() {
  const ordersContainer = document.querySelector('[data-section="my-orders"]');
  ordersContainer.innerHTML = '<h3>My Orders</h3><p>Loading...</p>';

  try {
    const res = await fetch('http://localhost:5000/api/order/my', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await res.json();

    if (orders.length === 0) {
      ordersContainer.innerHTML = '<h3>My Orders</h3><p>No orders found.</p>';
      return;
    }

    // Cache product names to avoid duplicate fetches
    const productNameCache = {};

    async function getProductName(productId) {
      if (productNameCache[productId]) {
        return productNameCache[productId];
      }

      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const product = await res.json();
        productNameCache[productId] = product.name;
        return product.name;
      } catch (err) {
        console.error('Failed to get product name for ID:', productId, err);
        return 'Unknown Product';
      }
    }

    let html = '<h3>My Orders</h3>';
    html += '<div class="order-list">';

    for (const order of orders) {
      const itemsHtmlPromises = order.items.map(async item => {
        const name = await getProductName(item.productId);
        return `<li>${name} × ${item.quantity}</li>`;
      });

      const itemsHtmlArray = await Promise.all(itemsHtmlPromises);

      html += `
        <div class="order-card mb-4 p-3 border rounded">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> Rs. ${order.totalAmount}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
          <p><strong>Items:</strong></p>
          <ul>
            ${itemsHtmlArray.join('')}
          </ul>
        </div>
      `;
    }

    html += '</div>';
    ordersContainer.innerHTML = html;

  } catch (err) {
    console.error('Error loading orders:', err);
    ordersContainer.innerHTML = '<h3>My Orders</h3><p>Failed to load orders.</p>';
  }
}

async function loadAddress() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Unauthorized');

    const user = await res.json();
    const currentAddress = user.address || 'No address on file.';
    document.getElementById('current-address').textContent = currentAddress;
    document.getElementById('new-address').value = user.address || '';
  } catch (err) {
    console.error('Failed to load address:', err);
    document.getElementById('current-address').textContent = 'Failed to load address.';
  }
}

document.getElementById('save-address-btn').addEventListener('click', async () => {
  const newAddress = document.getElementById('new-address').value.trim();
  if (!newAddress) return showToast('Address cannot be empty.', 'error');

  try {
    const res = await fetch('http://localhost:5000/api/auth/address', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ address: newAddress })
    });

    if (!res.ok) throw new Error('Failed to update address');

    showToast('Address updated successfully!', 'success');
    loadAddress(); // Refresh current address
  } catch (err) {
    console.error(err);
    showToast('Error updating address.', 'error');
  }
});
