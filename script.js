'use strict';

/* CONFIG */
const CONFIG = {
  adminWA: '6285237648941',
  storeName: 'Mampir Dulu',
  location: 'Lt. 1 Gedung Siti Moendjijah, UNISA Yogyakarta',
};

/* PRICES */
const PRICES = {
  bakso: 1000,
  es:    7000,
};

const PRODUCT_NAMES = {
  bakso: 'Batagor (3 pcs)',
  es:    'Es Mangga Lumut',
};

/* STATE */
const qty = { bakso: 0, es: 0 };

/* ── 1. NAVBAR ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 300);
  highlightActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

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
    const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

/* ── 2. SCROLL TO TOP ── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 3. QTY CONTROLS ── */
function changeQty(item, delta) {
  qty[item] = Math.max(0, Math.min(50, qty[item] + delta));

  const inputMap = { bakso: 'qtyBakso', es: 'qtyEs' };
  document.getElementById(inputMap[item]).value = qty[item];

  const rowMap = { bakso: 'itemBakso', es: 'itemEs' };
  const row = document.getElementById(rowMap[item]);
  row.style.borderColor = qty[item] > 0 ? (item === 'es' ? 'var(--yellow-main)' : 'var(--green-main)') : '';
  row.style.background  = qty[item] > 0 ? (item === 'es' ? '#fffdf0' : 'var(--green-pale)') : '';

  updateSummary();
  clearError('itemError');
}

/* ── 4. SUMMARY ── */
function updateSummary() {
  const lines   = document.getElementById('summaryLines');
  const totalEl = document.getElementById('totalPrice');
  let total = 0;
  let html  = '';

  Object.entries(qty).forEach(([key, q]) => {
    if (q > 0) {
      const subtotal = q * PRICES[key];
      total += subtotal;
      const unit = key === 'bakso' ? 'porsi' : 'cup';
      html += `<div class="summary-line">
        <span>${PRODUCT_NAMES[key]} x${q} ${unit}</span>
        <span style="font-weight:600;color:var(--green-main)">${formatRp(subtotal)}</span>
      </div>`;
    }
  });

  lines.innerHTML = html || '<div class="summary-empty">Belum ada item dipilih</div>';
  totalEl.textContent = formatRp(total);
  totalEl.style.color = total > 0 ? 'var(--green-main)' : '';
}

function formatRp(num) {
  return 'Rp' + num.toLocaleString('id-ID');
}

/* ── 5. VALIDASI FORM ── */
function validateForm() {
  let valid = true;

  const name = document.getElementById('customerName').value.trim();
  if (!name || name.length < 2) {
    showError('nameError', 'Nama tidak boleh kosong (min 2 karakter).');
    document.getElementById('customerName').classList.add('error');
    valid = false;
  } else {
    clearError('nameError');
    document.getElementById('customerName').classList.remove('error');
  }

  let phone = document.getElementById('customerPhone').value.trim();
  if (phone.startsWith('0')) phone = phone.substring(1);
  document.getElementById('customerPhone').value = phone;
  const phoneRegex = /^8[0-9]{8,12}$/;
  if (!phone || !phoneRegex.test(phone)) {
    showError('phoneError', 'Format tidak valid. Contoh: 085xxx atau 85xxx');
    document.getElementById('customerPhone').classList.add('error');
    valid = false;
  } else {
    clearError('phoneError');
    document.getElementById('customerPhone').classList.remove('error');
  }

  const pickup = document.getElementById('pickupMethod').value;
  if (!pickup) {
    showError('pickupError', 'Pilih metode pengambilan.');
    document.getElementById('pickupMethod').classList.add('error');
    valid = false;
  } else {
    clearError('pickupError');
    document.getElementById('pickupMethod').classList.remove('error');
  }

  if (qty.bakso + qty.es === 0) {
    showError('itemError', 'Pilih minimal 1 item pesanan.');
    valid = false;
  } else {
    clearError('itemError');
  }

  return valid;
}

function showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearError(id)     { const el = document.getElementById(id); if (el) el.textContent = ''; }

['customerName', 'customerPhone', 'pickupMethod'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const map = { customerName: 'nameError', customerPhone: 'phoneError', pickupMethod: 'pickupError' };
    clearError(map[id]);
    document.getElementById(id).classList.remove('error');
  });
});

/* ── 6. ORDER ID ── */
function generateOrderId() {
  const date = new Date().toISOString().slice(2,10).replace(/-/g,'');
  const rand = Math.random().toString(36).substring(2,6).toUpperCase();
  return `MD-${date}-${rand}`;
}

/* ── 7. WA MESSAGE ── */
function buildWAMessage(orderId, name, phone, pickup, items, total, note) {
  const pickupLabel = pickup === 'pickup' ? 'Ambil Langsung (Pick-up)' : 'Pre-Order (konfirmasi jadwal)';
  let itemLines = '';
  items.forEach(({ name: n, qty: q, subtotal }) => {
    itemLines += `  - ${n} x${q} = ${formatRp(subtotal)}\n`;
  });

  const lines = [
    `Halo Admin ${CONFIG.storeName}!`,
    ``,
    `Saya ingin konfirmasi pesanan:`,
    ``,
    `*DETAIL PESANAN*`,
    `No. Order  : *${orderId}*`,
    `Nama       : ${name}`,
    `WhatsApp   : +62${phone}`,
    `Metode     : ${pickupLabel}`,
    ``,
    `*ITEM PESANAN*`,
    itemLines.trimEnd(),
    ``,
    `*Total     : ${formatRp(total)}*`,
    `Pembayaran : QRIS`,
    note ? `Catatan    : ${note}` : null,
    ``,
    `Lokasi     : ${CONFIG.location}`,
    ``,
    `Mohon konfirmasi. Terima kasih!`,
  ].filter(l => l !== null).join('\n');

  return encodeURIComponent(lines);
}

/* ── 8. FORM SUBMIT ── */
document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const name   = document.getElementById('customerName').value.trim();
  let phone    = document.getElementById('customerPhone').value.trim();
  if (phone.startsWith('0')) phone = phone.substring(1);
  const pickup = document.getElementById('pickupMethod').value;
  const note   = document.getElementById('orderNote').value.trim();

  const items = [];
  Object.entries(qty).forEach(([key, q]) => {
    if (q > 0) items.push({ name: PRODUCT_NAMES[key], qty: q, subtotal: q * PRICES[key] });
  });

  const total   = items.reduce((s, i) => s + i.subtotal, 0);
  const orderId = generateOrderId();
  openModal({ orderId, name, phone, pickup, items, total, note });
});

/* ── 9. MODAL ── */
function openModal({ orderId, name, phone, pickup, items, total, note }) {
  document.getElementById('modalOrderId').textContent = orderId;

  const pickupLabel = pickup === 'pickup' ? 'Ambil Langsung (Pick-up)' : 'Pre-Order';
  let html = `
    <div><strong>Nama:</strong> ${escapeHTML(name)}</div>
    <div><strong>WhatsApp:</strong> +62${escapeHTML(phone)}</div>
    <div><strong>Metode:</strong> ${pickupLabel}</div>
    <hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
  `;
  items.forEach(item => {
    html += `<div><strong>${escapeHTML(item.name)}</strong> x${item.qty} = <span style="color:var(--green-main);font-weight:700">${formatRp(item.subtotal)}</span></div>`;
  });
  html += `<hr style="border:none;border-top:1px solid var(--border);margin:8px 0">
    <div><strong>Total (QRIS):</strong> <span style="color:var(--green-main);font-size:1.05rem;font-weight:800">${formatRp(total)}</span></div>`;
  if (note) html += `<div style="margin-top:6px"><strong>Catatan:</strong> ${escapeHTML(note)}</div>`;
  document.getElementById('modalDetails').innerHTML = html;

  const waMsg = buildWAMessage(orderId, name, phone, pickup, items, total, note);
  const waUrl = `https://wa.me/${CONFIG.adminWA}?text=${waMsg}`;
  const waBtn = document.getElementById('waBtn');
  waBtn.href = waUrl;
  waBtn.onclick = (e) => { e.preventDefault(); window.open(waUrl, '_blank') || (window.location.href = waUrl); };

  document.getElementById('confirmModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('confirmModal').classList.remove('active');
  document.body.style.overflow = '';
  resetForm();
}

document.getElementById('confirmModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function resetForm() {
  document.getElementById('orderForm').reset();
  qty.bakso = 0; qty.es = 0;
  document.getElementById('qtyBakso').value = 0;
  document.getElementById('qtyEs').value    = 0;
  ['itemBakso','itemEs'].forEach(id => {
    const row = document.getElementById(id);
    row.style.borderColor = '';
    row.style.background  = '';
  });
  updateSummary();
  ['nameError','phoneError','pickupError','itemError'].forEach(clearError);
  ['customerName','customerPhone','pickupMethod'].forEach(id => document.getElementById(id).classList.remove('error'));
}

/* ── 10. COPY ORDER ID ── */
function copyOrderId() {
  const id  = document.getElementById('modalOrderId').textContent;
  const btn = document.querySelector('.copy-btn');
  navigator.clipboard.writeText(id).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'var(--green-main)';
    btn.style.color = 'white';
    setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; btn.style.background = ''; btn.style.color = ''; }, 2000);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = id; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
  });
}

/* ── 11. SCROLL TO ORDER ── */
function scrollToOrder(preSelect) {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    if (preSelect === 'bakso') changeQty('bakso', 1);
    else if (preSelect === 'es') changeQty('es', 1);
  }, 600);
}

/* ── 12. DISPLAY WA ── */
function updateDisplayWA() {
  const el = document.getElementById('displayWaNumber');
  if (el) {
    const raw = CONFIG.adminWA.replace(/^62/, '');
    el.textContent = '+62 ' + raw.replace(/(\d{3})(\d{4})(\d{4,})/, '$1-$2-$3');
  }
}

/* ── 13. ESCAPE HTML ── */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ── 14. INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updateSummary();
  updateDisplayWA();
  highlightActiveNav();

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.classList.add('fade-in-up');

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
