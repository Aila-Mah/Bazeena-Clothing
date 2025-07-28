const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '../Auth/Login/Login.html';
}

async function getUserId() {
  const res = await fetch('http://localhost:5000/api/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data._id;
}

async function fetchCart(userId) {
  const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
  return await res.json();
}

async function updateCartUI(userId) {
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('cart-summary');
  container.innerHTML = '';
  summary.innerHTML = '';
  const cart = await fetchCart(userId);
  let total = 0;

  
  if (!cart.items || cart.items.length === 0) {
    container.innerHTML += '<p>Your cart is empty.</p>';
    return;
  }

  cart.items.forEach(({ productId: product, quantity }) => {
    if (!product) return;
    const card = document.createElement('div');
    card.className = 'product-card position-relative';

    const imgSrc = product.images?.[0] || 'https://via.placeholder.com/300x400';
    const subtotal = product.price * quantity;
    total += subtotal;

    card.innerHTML = `
      <img src="${imgSrc}" class="product-image" />
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">PKR ${product.price.toLocaleString()}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${userId}', '${product._id}', -1)">−</button>
          <span class="qty-value">${quantity}</span>
          <button class="qty-btn" onclick="changeQty('${userId}', '${product._id}', 1)">+</button>
        </div>
        <div class="product-price mt-2">Subtotal: PKR ${subtotal.toLocaleString()}</div>
      </div>
      <button class="delete-btn" onclick="removeItem('${userId}', '${product._id}')">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;

    container.appendChild(card);
  });


  const headerRow = document.createElement('div');
  headerRow.className = 'd-flex justify-content-between align-items-center mb-3';
  headerRow.innerHTML = `
    <a href="#" class="text-danger fw-semibold clear" onclick="clearCart('${userId}')">Clear Cart</a>
  `;
  container.appendChild(headerRow);

  const delivery = 100;
  const fbrCharges = 1;
  const grandTotal = total + delivery + fbrCharges;

  summary.innerHTML = `
    <h5 class="mb-3"><strong>ORDER SUMMARY</strong></h5>
    <div class="d-flex justify-content-between border-bottom mb-2">
      <span>Price incl. tax</span>
      <span class="fw-semibold">PKR ${total.toLocaleString()}</span>
    </div>
    <div class="d-flex justify-content-between border-bottom mb-2">
      <span>Delivery charges</span>
      <span class="fw-semibold">PKR ${delivery}</span>
    </div>
    <div class="d-flex justify-content-between border-bottom mb-3">
      <span>FBR service charges</span>
      <span class="fw-semibold">PKR ${fbrCharges}</span>
    </div>
    <div class="d-flex justify-content-between fw-bold mb-3">
      <span>Total</span>
      <span class="fw-bold">PKR ${grandTotal.toLocaleString()}</span>
    </div>
    <button id="checkout-btn" class="btn btn-dark w-100 mt-2">PROCEED TO CHECKOUT</button>
  `;

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    console.log('CLicked Checkout');
    window.location.href = '../Checkout/checkout.html'; // ✅ Adjust path if needed
  });
}
}

async function changeQty(userId, productId, delta) {
  const res = await fetch('http://localhost:5000/api/cart/change', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, productId, change: delta })
  });

  const result = await res.json();
  if (result.success || result.message === 'Quantity updated' || res.status === 200) {
    updateCartUI(userId);
  } else {
    alert(result.message || 'Failed to update cart');
  }
}

async function removeItem(userId, productId) {
  const res = await fetch('http://localhost:5000/api/cart/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId })
  });
  const result = await res.json();
  if (result.success || result.message === 'Item removed') {
    updateCartUI(userId);
  } else {
    alert(result.message || 'Failed to remove item');
  }
}

async function clearCart(userId) {
  const confirmClear = confirm("Are you sure you want to clear your cart?");
  if (!confirmClear) return;

  const res = await fetch('http://localhost:5000/api/cart/clear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const result = await res.json();
  if (result.success || result.message === 'Cart cleared') {
    updateCartUI(userId);
  } else {
    alert(result.message || 'Failed to clear cart');
  }
}

// Init
(async () => {
  const userId = await getUserId();
  if (userId) updateCartUI(userId);
})();
