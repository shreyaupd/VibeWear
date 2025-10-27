const CART_KEY = 'kapada_cart_v1';

// format price
function formatPrice(v) {
  return `$${Number(v).toFixed(2)}`;
}

// render a single product card
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

// main loader function: takes container, category, loading message
function loadProducts(containerId, category, loadingMessage) {
  const productsContainer = document.getElementById(containerId);
  if (!productsContainer) return;

  productsContainer.innerHTML = loadingMessage;

  let url;
  if (category === 'men') url = "https://fakestoreapi.com/products/category/men's clothing";
  else if (category === 'women') url = "https://fakestoreapi.com/products/category/women's clothing";
  else url = 'https://fakestoreapi.com/products'; // fallback: all products

  fetch(url)
    .then(res => res.json())
    .then(products => {
      productsContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      products.forEach(product => fragment.append(renderProductCard(product)));
      productsContainer.appendChild(fragment);
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      productsContainer.textContent = 'Failed to load products.';
    });
}
