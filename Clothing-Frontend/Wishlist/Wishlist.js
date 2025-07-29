const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '../Auth/Login/Login.html';
}

async function getUserIdFromProfile() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Unauthorized');

    const data = await res.json();
    return data._id;
  } catch (err) {
    console.error('Error getting profile:', err);
    window.location.href = '../Auth/Login/Login.html';
  }
}

async function loadWishlist(userId) {
  const grid = document.getElementById('product-grid');

  try {
    const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
    const data = await res.json();

    if (!data.products || data.products.length === 0) {
      grid.innerHTML = '<p class="text-center">Your wishlist is empty.</p>';
      return;
    }

    grid.innerHTML = ''; 
    data.products.forEach(product => {
        const imgSrc = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/300x400?text=No+Image';

      const pieceText = product.piece ? `${product.piece} Piece` : '';

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${imgSrc}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-piece">Fabrics ${pieceText}</div>
          <div class="product-price">PKR ${product.price.toLocaleString()}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        const detailUrl = `../ProductDetail/ProductDetail.html?id=${product._id}`;
        window.location.href = detailUrl;
      });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load wishlist:', err);
    grid.innerHTML = '<p class="text-center">Error loading wishlist.</p>';
  }
}

(async () => {
  const userId = await getUserIdFromProfile();
  if (userId) {
    loadWishlist(userId);
  }
})();
