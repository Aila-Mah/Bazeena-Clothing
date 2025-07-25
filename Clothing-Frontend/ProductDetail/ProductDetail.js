
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../Auth/Login/Login.html';
    return;
  }

  const qtyInput = document.getElementById('quantity');
  const addToCartBtn = document.getElementById('add-to-cart');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  let product = null;

  async function getUserId() {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data._id;
  }

  // Load product data
  if (productId) {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(p => {
        product = p;

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
          mainImg.src = 'https://via.placeholder.com/400x600?text=No+Image';
        }
      })
      .catch(err => {
        console.error('Error loading product:', err);
        alert('Failed to load product.');
      });
  }

  // Quantity buttons
  document.getElementById('increase').addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });

  document.getElementById('decrease').addEventListener('click', () => {
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
    }
  });

  // Add to cart logic
  addToCartBtn.addEventListener('click', async () => {
    const quantity = parseInt(qtyInput.value);

    if (!product) {
      alert('Product not loaded yet.');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items in stock.`);
      return;
    }

    try {
      const userId = await getUserId();

      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert('Added to cart successfully!');
        updateCartUI(userId);
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Error occurred while adding to cart.');
    }
  });
});

