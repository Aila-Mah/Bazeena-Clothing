document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded triggered");

  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No token found. Redirecting to login...");
    window.location.href = '../Auth/Login/Login.html';
    return;
  }
  console.log("Token found:", token);

  const qtyInput = document.getElementById('quantity');
  const addToCartBtn = document.getElementById('add-to-cart');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  console.log("Product ID from URL:", productId);

  let product = null;

  async function getUserId() {
    console.log("📥 Fetching user profile...");
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("👤 User profile:", data);
    return data._id;
  }

  if (productId) {
    console.log("📦 Fetching product details...");
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(p => {
        console.log("Product fetched:", p);
        product = p;

        // UI update
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `PKR ${product.price.toLocaleString()}`;
        document.getElementById('product-piece').textContent = product.piece + ' Piece';
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-colors').textContent = product.color.join(', ');
        document.getElementById('product-description').textContent = product.description || '-';
        document.getElementById('product-stock').textContent = product.stock;

        document.getElementById('top-fabric').textContent = product.details.topFabric;
        document.getElementById('top-length').textContent = product.details.topLength;
        document.getElementById('bottom-fabric').textContent = product.details.bottomFabric;
        document.getElementById('bottom-length').textContent = product.details.bottomLength;
        document.getElementById('dupatta-fabric').textContent = product.details.dupattaFabric;
        document.getElementById('dupatta-length').textContent = product.details.dupattaLength;
        document.getElementById('material').textContent = product.details.material;

        // Images
        const mainImg = document.getElementById('main-image');
        const thumbnailsContainer = document.getElementById('thumbnails');
        thumbnailsContainer.innerHTML = '';

        if (product.images && product.images.length > 0) {
          mainImg.src = product.images[0];

          product.images.forEach((imgUrl, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgUrl;
            if (index === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
              mainImg.src = imgUrl;
              document.querySelectorAll('#thumbnails img').forEach(i => i.classList.remove('active'));
              thumb.classList.add('active');
            });
            thumbnailsContainer.appendChild(thumb);
          });
        } else {
          console.warn("No images found for product");
          mainImg.src = 'https://via.placeholder.com/400x600?text=No+Image';
        }
      })
      .catch(err => {
        console.error('Error loading product:', err);
        alert('Failed to load product.');
      });
  } else {
    console.warn("No productId in URL. Cannot fetch product.");
  }

  // Quantity buttons
  document.getElementById('increase').addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    console.log("Quantity increased to:", qtyInput.value);
  });

  document.getElementById('decrease').addEventListener('click', () => {
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
      console.log("Quantity decreased to:", qtyInput.value);
    }
  });

  // Add to cart logic
  addToCartBtn.addEventListener('click', async () => {
    const quantity = parseInt(qtyInput.value);
    console.log("Add to cart clicked with quantity:", quantity);

    if (!product) {
      showToast('Product not loaded yet.', 'error');
      console.error("Cannot add to cart - product not loaded.");
      return;
    }

    if (quantity > product.stock) {
      showToast(`Only ${product.stock} items in stock.`, 'error');
      console.warn(`⚠️ Requested ${quantity} but only ${product.stock} in stock.`);
      return;
    }

    try {
      const userId = await getUserId();
      console.log("Adding to cart for user:", userId);

      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity
        })
      });

      const result = await res.json();
      console.log("Server response:", result);

      if (res.ok) {
        showToast('Added to cart successfully!', 'success');

      } else {
        showToast(result.message || 'Failed to add to cart', 'error');
        console.warn("Add to cart failed:", result.message);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      showToast('Error occurred while adding to cart.', 'error');
    }
  });

});

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
