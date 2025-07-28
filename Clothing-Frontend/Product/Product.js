document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../Auth/Login/Login.html';
    return;
  }

  // Fetch user ID from backend
  async function getUserId() {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      window.location.href = '../Auth/Login/Login.html';
      return null;
    }

    const data = await res.json();
    localStorage.setItem('userId', data._id); // Optional: cache for future use
    return data._id;
  }

  const userId = await getUserId();
  if (!userId) return;

  // Continue only if user is authenticated and ID is fetched
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  let apiUrl = 'http://localhost:5000/api/products';
  if (category) {
    apiUrl += `/category/${encodeURIComponent(category)}`;
  }

  fetch(apiUrl)
    .then(res => res.json())
    .then(products => {
      const grid = document.getElementById('product-grid');
      grid.innerHTML = '';

      if (products.length === 0) {
        grid.innerHTML = `<p>No products found in ${category || 'All'} category.</p>`;
        return;
      }

      products.forEach(product => {
        const imgSrc = product.images && product.images.length > 0
          ? product.images[0]
          : 'https://via.placeholder.com/300x400?text=No+Image';

        const pieceText = product.piece ? `${product.piece} Piece` : '';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="image-wrapper">
            <img src="${imgSrc}" alt="${product.name}" class="product-image">
            <i class="fa-regular fa-heart wishlist-icon" data-id="${product._id}" title="Add to Wishlist"></i>
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-piece">Fabrics ${pieceText}</div>
            <div class="product-price">
              PKR ${product.price.toLocaleString()}
              <i class="fa-solid fa-cart-plus cart-icon" data-id="${product._id}" title="Add to Cart"></i>
            </div>
          </div>
        `;

        grid.appendChild(card);

        // Card click = go to product detail
        card.addEventListener('click', () => {
          const detailUrl = `../ProductDetail/ProductDetail.html?id=${product._id}`;
          window.location.href = detailUrl;
        });

        // Wishlist click
        const wishlistIcon = card.querySelector('.wishlist-icon');
        wishlistIcon.addEventListener('click', async (e) => {
          e.stopPropagation();
          const productId = e.target.dataset.id;

          try {
            const res = await fetch('http://localhost:5000/api/wishlist/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ userId, productId })
            });

            const data = await res.json();
            if (res.ok) {
              showToast('Added to wishlist', 'success');
              e.target.classList.remove('fa-regular');
              e.target.classList.add('fa-solid');
            } else {
              showToast('Failed to add to wishlist', 'error');
            }
          } catch (err) {
            console.error('Wishlist error:', err);
          }
        });

        // Cart click
        const cartIcon = card.querySelector('.cart-icon');
        cartIcon.addEventListener('click', async (e) => {
          e.stopPropagation();
          const productId = e.target.dataset.id;
          console.log("🛒 Add to Cart clicked:", productId);  // 👈 Add this line

          try {
            const res = await fetch('http://localhost:5000/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ userId, productId, quantity: 1 })
            });

            const data = await res.json();
            if (res.ok) {
              showToast('Added to cart', 'success');

            } else {
              showToast('Failed to add to cart', 'error');
            }
          } catch (err) {
            console.error('Cart error:', err);
          }
        });
      });
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      document.getElementById('product-grid').innerHTML = '<p>Failed to load products.</p>';
    });
});


function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
