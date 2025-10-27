// cart.js - show cart, adjust qty, and call checkout API
const CART_KEY = 'vibewear_cart_v1';
const API_BASE = 'http://localhost:4000/api';

const cartContainer = document.querySelector('.cart-items');
const totalDisplay = document.querySelector('.cart-total');
const form = document.getElementById('checkoutForm');

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function calcTotal(cart) {
  return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.textContent = 'Your cart is empty.';
    totalDisplay.textContent = '';
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
  row.innerHTML = `
  <div style="flex:1">
    <strong>${escapeHtml(item.name)}</strong>
    <div style=" font-size:.95rem">$${Number(item.price).toFixed(2)}</div>
  </div>
  <div style="display:flex; gap:.4rem; align-items:center">
    <button data-action="dec" data-id="${item.id}" class="cart-btn small">-</button>
    <div style="min-width:22px; text-align:center">${item.qty}</div>
    <button data-action="inc" data-id="${item.id}" class="cart-btn small">+</button>
    <button data-action="remove" data-id="${item.id}" class="cart-btn remove">Remove</button>
  </div>
`;

    cartContainer.appendChild(row);
  });

  totalDisplay.textContent = 'Total: $' + calcTotal(cart).toFixed(2);
}

/* helpers */
function escapeHtml(str='') {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

/* cart buttons */
cartContainer.addEventListener('click', (e) => {
  const el = e.target;
  if (!el.dataset.action) return;
  const id = Number(el.dataset.id);
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;

  if (el.dataset.action === 'inc') cart[idx].qty++;
  else if (el.dataset.action === 'dec') {
    cart[idx].qty--;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  } else if (el.dataset.action === 'remove') {
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
});

/* checkout submission */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cart = getCart();
  if (cart.length === 0) return alert('Cart is empty');

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const payment_method = form.payment_method.value;

  if (!name || !email) return alert('Please provide name and email');

  const items = cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));

  // simple UX: disable submit while processing
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Placing order...';

  fetch(API_BASE + '/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: name,
      customer_email: email,
      payment_method,
      items
    })
  })
    .then(r => r.json().then(body => ({ ok: r.ok, body })))
    .then(({ ok, body }) => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
      if (!ok) {
        console.error('Checkout error:', body);
        return alert('Failed to place order: ' + (body.error || 'unknown'));
      }
      alert('Order placed! Order ID: ' + body.orderId);
      localStorage.removeItem(CART_KEY);
      window.location.href = './index.html';
    })
    .catch(err => {
      console.error('Network error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
      alert('Network error placing order');
    });
});

/* init render */
document.addEventListener('DOMContentLoaded', renderCart);
