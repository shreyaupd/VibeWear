const productsContainer = document.getElementById('products');
const CART_KEY = 'kapada_cart_v1';

function formatPrice(v) {
  return `$${Number(v).toFixed(2)}`;
}

function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.title;

  const title = document.createElement('h2');
  title.textContent = product.title;

  const price = document.createElement('p');
  price.textContent = formatPrice(product.price);

  const btn = document.createElement('button');
  btn.textContent = 'Add to cart';
  btn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const found = cart.find(i => i.id === product.id);
    if (found) found.qty++;
    else cart.push({ id: product.id, name: product.title, price: product.price, qty: 1 });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    alert(`${product.title} added to cart`);
  });

  card.append(img, title, price, btn);
  return card;
}

function loadProducts() {
  productsContainer.innerHTML = 'Loading products...';
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      const clothes = products.filter(
  p => p.category === "men's clothing" || p.category === "women's clothing"
);

      
      productsContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      clothes.forEach(product => fragment.append(renderProductCard(product)));
      productsContainer.appendChild(fragment);
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      productsContainer.textContent = 'Failed to load products';
    });
}

document.addEventListener('DOMContentLoaded', loadProducts);
