/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAMPIR DULU â€” script.js
   Handles: navbar, order qty, form validation,
            order ID generation, modal, WA message
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

'use strict';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   CONFIG â€” ganti nomor WA admin di sini
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CONFIG = {
  adminWA: '6285237648941',   // WA Admin Mampir Dulu
  storeName: 'Mampir Dulu',
  location: 'Lt. 1 Gedung Siti Moendjijah, UNISA Yogyakarta',
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PRICES
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PRICES = {
  bakso: 1000,
  es:    6000,
  paket: 10000, // default Paket S, will be overridden by tier
};

const PAKET_TIERS = {
  S: { label: 'Paket S (5 Batagor + 1 Es)', price: 10000, normalPrice: 11000 },
  M: { label: 'Paket M (10 Batagor + 1 Es)', price: 14000, normalPrice: 16000 },
  L: { label: 'Paket L (10 Batagor + 2 Es)', price: 19000, normalPrice: 22000 },
};

const PRODUCT_NAMES = {
  bakso: 'Batagor',
  es:    'Es Mangga Lumut',
  paket: 'Paket Mampir Dulu (5 Batagor + 1 Es)',
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   STATE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const qty = { bakso: 0, es: 0, paket: 0 };

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   1. NAVBAR â€” scroll effect + mobile
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // scroll-to-top button
  const scrollBtn = document.getElementById('scrollTop');
  scrollBtn.classList.toggle('visible', window.scrollY > 300);

  // active nav link highlight
  highlightActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 90;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const link   = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   2. SCROLL-TO-TOP BUTTON
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   3. QUANTITY CONTROLS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function changeQty(item, delta) {
  const max = item === 'paket' ? 20 : 50;
  qty[item] = Math.max(0, Math.min(max, qty[item] + delta));

  // Update input display
  const inputMap = { bakso: 'qtyBakso', es: 'qtyEs', paket: 'qtyPaket' };
  document.getElementById(inputMap[item]).value = qty[item];

  // Highlight item row if qty > 0
  const rowMap = { bakso: 'itemBakso', es: 'itemEs', paket: 'itemPaket' };
  const row = document.getElementById(rowMap[item]);
  row.style.borderColor = qty[item] > 0
    ? (item === 'es' ? 'var(--yellow-main)' : 'var(--green-main)')
    : '';
  row.style.background = qty[item] > 0
    ? (item === 'paket' ? 'var(--yellow-pale)' : item === 'es' ? '#fffdf0' : 'var(--green-pale)')
    : '';

  updateSummary();
  clearItemError();
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   4. ORDER SUMMARY (live update)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function updateSummary() {
  const lines    = document.getElementById('summaryLines');
  const totalEl  = document.getElementById('totalPrice');
  let total      = 0;
  let html       = '';

  // Bakso & Es satuan
  ['bakso', 'es'].forEach(key => {
    const q = qty[key];
    if (q > 0) {
      const subtotal = q * PRICES[key];
      total += subtotal;
      const unit = key === 'bakso' ? 'pcs' : 'cup';
      html += `
        <div class="summary-line">
          <span>${PRODUCT_NAMES[key]} Ã— ${q} ${unit}</span>
          <span style="font-weight:600;color:var(--green-main)">${formatRp(subtotal)}</span>
        </div>`;
    }
  });

  // Paket bundle â€” harga tergantung tier
  if (qty.paket > 0) {
    const tierSel = document.getElementById('paketTier');
    const tier    = tierSel ? PAKET_TIERS[tierSel.value] : null;
    const tierPrice = tier ? tier.price : 10000;
    const tierLabel = tier ? tier.label : 'Paket Bundle';
    const subtotal  = qty.paket * tierPrice;
    total += subtotal;
    html += `
      <div class="summary-line">
        <span>${tierLabel} Ã— ${qty.paket}</span>
        <span style="font-weight:600;color:var(--yellow-dark)">${formatRp(subtotal)}</span>
      </div>`;
  }

  lines.innerHTML = html || '<div class="summary-empty">Belum ada item dipilih</div>';
  totalEl.textContent = formatRp(total);
  totalEl.style.color = total > 0 ? 'var(--green-main)' : '';
}

function formatRp(num) {
  return 'Rp' + num.toLocaleString('id-ID');
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   5. FORM VALIDATION
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function validateForm() {
  let valid = true;

  // Name
  const name = document.getElementById('customerName').value.trim();
  if (!name) {
    showError('nameError', 'Nama tidak boleh kosong.');
    document.getElementById('customerName').classList.add('error');
    valid = false;
  } else if (name.length < 2) {
    showError('nameError', 'Nama minimal 2 karakter.');
    document.getElementById('customerName').classList.add('error');
    valid = false;
  } else {
    clearError('nameError');
    document.getElementById('customerName').classList.remove('error');
  }

  // Phone â€” auto strip leading 0, accept both formats
  let phone = document.getElementById('customerPhone').value.trim();
  // If user typed 085xxx, strip the leading 0
  if (phone.startsWith('0')) phone = phone.substring(1);
  document.getElementById('customerPhone').value = phone; // update field display
  const phoneRegex = /^8[0-9]{8,12}$/;
  if (!phone) {
    showError('phoneError', 'Nomor WhatsApp tidak boleh kosong.');
    document.getElementById('customerPhone').classList.add('error');
    valid = false;
  } else if (!phoneRegex.test(phone)) {
    showError('phoneError', 'Format tidak valid. Contoh: 085xxx atau 85xxx');
    document.getElementById('customerPhone').classList.add('error');
    valid = false;
  } else {
    clearError('phoneError');
    document.getElementById('customerPhone').classList.remove('error');
  }

  // Pickup method
  const pickup = document.getElementById('pickupMethod').value;
  if (!pickup) {
    showError('pickupError', 'Pilih metode pengambilan.');
    document.getElementById('pickupMethod').classList.add('error');
    valid = false;
  } else {
    clearError('pickupError');
    document.getElementById('pickupMethod').classList.remove('error');
  }

  // At least 1 item
  const totalQty = qty.bakso + qty.es + qty.paket;
  if (totalQty === 0) {
    showError('itemError', 'Pilih minimal 1 item pesanan.');
    valid = false;
  } else {
    clearError('itemError');
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
function clearItemError() {
  clearError('itemError');
}

// Live clear on input
['customerName', 'customerPhone', 'pickupMethod'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const errMap = {
      customerName: 'nameError',
      customerPhone: 'phoneError',
      pickupMethod: 'pickupError',
    };
    clearError(errMap[id]);
    document.getElementById(id).classList.remove('error');
  });
});

// Update summary when paket tier changes
document.getElementById('paketTier').addEventListener('change', updateSummary);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   6. ORDER ID GENERATOR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function generateOrderId() {
  const now    = new Date();
  const date   = now.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const rand   = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MD-${date}-${rand}`;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   7. WHATSAPP MESSAGE BUILDER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function buildWAMessage(orderId, name, phone, pickup, items, total, note) {
  const pickupLabel = pickup === 'pickup'
    ? 'Ambil Langsung (Pick-up)'
    : 'Pre-Order (konfirmasi jadwal)';

  let itemLines = '';
  items.forEach(({ name: n, qty: q, subtotal }) => {
    itemLines += `  â€¢ ${n} Ã— ${q} = ${formatRp(subtotal)}\n`;
  });

  const msg = [
    `Halo Admin ${CONFIG.storeName} ðŸ‘‹`,
    ``,
    `Saya ingin konfirmasi pesanan berikut:`,
    ``,
    `ðŸ“‹ *DETAIL PESANAN*`,
    `ðŸ”– No. Order  : *${orderId}*`,
    `ðŸ‘¤ Nama       : ${name}`,
    `ðŸ“± WhatsApp   : +62${phone}`,
    `ðŸ›ï¸ Metode      : ${pickupLabel}`,
    ``,
    `ðŸ§¾ *ITEM PESANAN*`,
    itemLines.trimEnd(),
    ``,
    `ðŸ’° *Total     : ${formatRp(total)}*`,
    `ðŸ’³ Pembayaran : QRIS`,
    note ? `\nðŸ“ Catatan    : ${note}` : '',
    ``,
    `ðŸ“ Lokasi     : ${CONFIG.location}`,
    ``,
    `Mohon konfirmasi pesanan saya. Terima kasih! ðŸ™`,
  ].filter(line => line !== null && line !== undefined).join('\n');

  return encodeURIComponent(msg);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   8. FORM SUBMIT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const name   = document.getElementById('customerName').value.trim();
  // Read phone after validateForm may have stripped leading 0
  let phone    = document.getElementById('customerPhone').value.trim();
  if (phone.startsWith('0')) phone = phone.substring(1);
  const pickup = document.getElementById('pickupMethod').value;
  const note   = document.getElementById('orderNote').value.trim();

  // Build items array
  const items = [];
  // Bakso & Es satuan
  ['bakso', 'es'].forEach(key => {
    if (qty[key] > 0) {
      items.push({ name: PRODUCT_NAMES[key], qty: qty[key], subtotal: qty[key] * PRICES[key] });
    }
  });
  // Paket â€” ambil tier yang dipilih
  if (qty.paket > 0) {
    const tierSel   = document.getElementById('paketTier');
    const tier      = PAKET_TIERS[tierSel.value] || PAKET_TIERS['S'];
    items.push({ name: tier.label, qty: qty.paket, subtotal: qty.paket * tier.price });
  }

  const total   = items.reduce((sum, i) => sum + i.subtotal, 0);
  const orderId = generateOrderId();

  // Show modal
  openModal({ orderId, name, phone, pickup, items, total, note });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   9. MODAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function openModal({ orderId, name, phone, pickup, items, total, note }) {
  const overlay = document.getElementById('confirmModal');

  // Order ID
  document.getElementById('modalOrderId').textContent = orderId;

  // Details
  const pickupLabel = pickup === 'pickup' ? 'Ambil Langsung (Pick-up)' : 'Pre-Order';
  let detailHTML = `
    <div><strong>Nama:</strong> ${escapeHTML(name)}</div>
    <div><strong>WhatsApp:</strong> +62${escapeHTML(phone)}</div>
    <div><strong>Metode:</strong> ${pickupLabel}</div>
    <hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
  `;
  items.forEach(item => {
    detailHTML += `<div><strong>${escapeHTML(item.name)}</strong> Ã— ${item.qty} = <span style="color:var(--green-main);font-weight:700">${formatRp(item.subtotal)}</span></div>`;
  });
  detailHTML += `<hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
    <div><strong>Total Bayar (QRIS):</strong> <span style="color:var(--green-main);font-size:1.05rem;font-weight:800">${formatRp(total)}</span></div>`;
  if (note) {
    detailHTML += `<div style="margin-top:6px"><strong>Catatan:</strong> ${escapeHTML(note)}</div>`;
  }
  document.getElementById('modalDetails').innerHTML = detailHTML;

  // WA Button â€” build message then set href + onclick fallback
  const waMsg = buildWAMessage(orderId, name, phone, pickup, items, total, note);
  const waUrl = `https://wa.me/${CONFIG.adminWA}?text=${waMsg}`;
  const waBtnEl = document.getElementById('waBtn');
  waBtnEl.href = waUrl;
  waBtnEl.onclick = function(e) {
    e.preventDefault();
    window.open(waUrl, '_blank') || (window.location.href = waUrl);
  };

  // Show modal
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('confirmModal');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Reset form after close
  resetForm();
}

// Close modal on overlay click
document.getElementById('confirmModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function resetForm() {
  document.getElementById('orderForm').reset();
  qty.bakso = 0; qty.es = 0; qty.paket = 0;
  document.getElementById('qtyBakso').value = 0;
  document.getElementById('qtyEs').value    = 0;
  document.getElementById('qtyPaket').value = 0;

  // Reset row styles
  ['itemBakso','itemEs'].forEach(id => {
    const row = document.getElementById(id);
    row.style.borderColor = '';
    row.style.background  = '';
  });
  // Bundle item: restore its CSS class background by removing inline override
  const paketRow = document.getElementById('itemPaket');
  paketRow.style.borderColor = '';
  paketRow.style.background  = '';

  updateSummary();
  ['nameError','phoneError','pickupError','itemError'].forEach(clearError);
  ['customerName','customerPhone','pickupMethod'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   10. COPY ORDER ID
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function copyOrderId() {
  const id   = document.getElementById('modalOrderId').textContent;
  const btn  = document.querySelector('.copy-btn');

  navigator.clipboard.writeText(id).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'var(--green-main)';
    btn.style.color = 'var(--white)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }).catch(() => {
    // fallback for older browsers
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   11. SCROLL TO ORDER (from menu btn)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function scrollToOrder(preSelect) {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Pre-fill qty based on selected product
  setTimeout(() => {
    if (preSelect === 'bakso') changeQty('bakso', 1);
    else if (preSelect === 'es')   changeQty('es', 1);
    else if (preSelect === 'paket') changeQty('paket', 1);
  }, 600);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   12. UPDATE WA NUMBER IN CONTACT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function updateDisplayWA() {
  const el = document.getElementById('displayWaNumber');
  if (el) {
    // Format: +62 852-3764-8941
    const raw = CONFIG.adminWA.replace(/^62/, '');
    const formatted = '+62 ' + raw.replace(/(\d{3})(\d{4})(\d{4,})/, '$1-$2-$3');
    el.textContent = formatted;
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   13. HELPER â€” XSS safe
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   14. INIT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
document.addEventListener('DOMContentLoaded', () => {
  updateSummary();
  updateDisplayWA();
  highlightActiveNav();

  // Animate hero elements on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.classList.add('fade-in-up');

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.menu-card, .side-card, .step, .qris-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
});

