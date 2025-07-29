const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '../Auth/Login/Login.html';
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function getUserId() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Unauthorized');

    const data = await res.json();
    return data._id;
  } catch (err) {
    showToast('Session expired. Please login again.', 'error');
    window.location.href = '../Auth/Login/Login.html';
  }
}

async function loadUserAddress() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Unauthorized');

    const user = await res.json();
    const savedAddress = user.address || '';

    document.getElementById('shippingAddress').value = savedAddress;
  } catch (err) {
    console.error('Failed to load address:', err);
    showToast('Failed to load saved address.', 'error');
  }
}

async function fetchCart(userId) {
  const res = await fetch(`http://localhost:5000/api/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  try {
    return await res.json();
  } catch (err) {
    showToast('Failed to load cart', 'error');
    return { items: [] };
  }
}

function formatPrice(num) {
  return `PKR ${num.toLocaleString()}`;
}

async function updateOrderSummary(userId) {
  const container = document.getElementById('order-summary');
  const totalSummary = document.getElementById('total-summary');
  container.innerHTML = '';
  totalSummary.innerHTML = '';

  const cart = await fetchCart(userId);

  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('placeOrderBtn').disabled = true;
    return;
  }

  let subtotal = 0;
  cart.items.forEach(({ productId: product, quantity }) => {
    if (!product) return;
    const itemTotal = product.price * quantity;
    subtotal += itemTotal;

    const div = document.createElement('div');
    div.className = 'order-item d-flex justify-content-between';
    div.innerHTML = `
      <div>${product.name} (x${quantity})</div>
      <div>${formatPrice(itemTotal)}</div>
    `;
    container.appendChild(div);
  });

  const delivery = 100;
  const fbrCharges = 1;
  const grandTotal = subtotal + delivery + fbrCharges;

  totalSummary.innerHTML = `
    <div class="d-flex justify-content-between">
      <strong>Subtotal:</strong>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div class="d-flex justify-content-between">
      <strong>Delivery Charges:</strong>
      <span>${formatPrice(delivery)}</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <strong>FBR Charges:</strong>
      <span>${formatPrice(fbrCharges)}</span>
    </div>
    <div class="d-flex justify-content-between fw-bold fs-5">
      <strong>Total:</strong>
      <span>${formatPrice(grandTotal)}</span>
    </div>
  `;

  return { cart, grandTotal };
}

async function placeOrder(userId, cart, shippingAddress, totalAmount) {
  const orderData = {
    items: cart.items.map(({ productId: product, quantity }) => ({
      productId: product._id,
      quantity,
      priceAtPurchase: product.price,
    })),
    shippingAddress,
    totalAmount,
  };

  try {
    const res = await fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await res.json();

    if (res.ok) {
      await fetch('http://localhost:5000/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      showToast('Order placed successfully!', 'success');
      localStorage.setItem('activeTab', 'my-orders');
      localStorage.setItem('orderSuccess', 'true');

      setTimeout(() => {
        window.location.replace('../Account/Account.html');
      }, 2000); 


    } else {
      showToast(result.message || 'Failed to place order', 'error');
    }
  } catch (err) {
    console.error('Place Order Error:', err);
    showToast('Server error while placing order', 'error');
  }
}

(async () => {
  const userId = await getUserId();
  if (!userId) return;

  await loadUserAddress();

  const { cart, grandTotal } = await updateOrderSummary(userId);

  document.getElementById('placeOrderBtn').addEventListener('click', async () => {
    const address = document.getElementById('shippingAddress').value.trim();
    if (!address) {
      showToast('Please enter a shipping address.', 'error');
      return;
    }

    await placeOrder(userId, cart, address, grandTotal);
  });
})();
