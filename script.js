const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

const toastActions = [
  ['.catalog-btn', 'Каталог открыт'],
  ['.calculate-btn', 'Форма расчёта открыта'],
  ['.secondary-btn', 'Форма быстрого заказа открыта'],
  ['.measure-btn, .measure-order', 'Здесь будет форма записи на замер'],
  ['.review-btn', 'Форма отзыва открыта'],
  ['.item-quick-order', 'Форма быстрого заказа открыта'],
  ['.wholesale-card button', 'Запрос коммерческого предложения открыт'],
  ['.summary__question, .question-order', 'Здесь будет форма вопроса менеджеру'],
  ['.video-request', 'Здесь будет форма запроса видео'],
  ['.gallery__video', 'Здесь будет видео товара'],
];

toastActions.forEach(([selector, message]) => {
  document.querySelectorAll(selector).forEach((button) => button.addEventListener('click', () => showToast(message)));
});

document.querySelectorAll('[data-toast]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showToast(link.dataset.toast);
  });
});

function updateBadge(counter, value, hideWhenEmpty = false) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  counter.textContent = String(count);
  counter.dataset.digits = String(count).length;
  counter.hidden = hideWhenEmpty && count === 0;
}

document.querySelectorAll('.round-action > span').forEach((counter) => {
  updateBadge(counter, counter.textContent, counter.classList.contains('header-counter'));
});
function addToCart() {
  const target = document.querySelector('.round-action--cart');
  const counter = target.querySelector('span');
  updateBadge(counter, Number(counter.textContent) + 1);
  showToast('Товар добавлен в корзину');
}
document.querySelector('.primary-btn').addEventListener('click', addToCart);
document.querySelector('.item-cart').addEventListener('click', addToCart);

document.querySelectorAll('.collection-card').forEach((card) => {
  const input = card.querySelector('.collection-quantity input');
  function updateQuantity(value) {
    const quantity = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
    input.value = String(quantity);
    input.style.width = `${input.value.length}ch`;
  }
  input.addEventListener('input', () => updateQuantity(Number(input.value)));
  card.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => updateQuantity(Number(input.value) + Number(button.dataset.step)));
  });
  card.querySelector('.collection-cart').addEventListener('click', addToCart);
  card.querySelector('.collection-quick-order').addEventListener('click', () => showToast('Здесь будет форма быстрого заказа'));
  card.querySelectorAll('.collection-card__photo, .collection-card__title').forEach((button) => {
    button.addEventListener('click', () => showToast('Здесь будет карточка товара'));
  });
});

document.querySelectorAll('.product-actions button').forEach((button, index) => {
  const itemButton = document.querySelector(index === 0 ? '.item-favorite' : '.item-compare');
  function toggleProductAction(event) {
    const active = button.classList.toggle('is-active');
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('img').src = active ? button.dataset.activeIcon : button.dataset.icon;
    button.querySelector('span').textContent = active ? button.dataset.activeLabel : button.dataset.label;
    itemButton?.setAttribute('aria-pressed', String(active));
    itemButton?.setAttribute('aria-label', active ? (index === 0 ? 'Удалить из избранного' : 'Удалить из сравнения') : (index === 0 ? 'Добавить в избранное' : 'Добавить к сравнению'));
    const target = document.querySelector(index === 0
      ? '.round-action[aria-label="Избранное"]'
      : '.round-action[aria-label="Сравнение"]');
    updateBadge(target.querySelector('.header-counter'), active ? 1 : 0, true);
  }
  itemButton?.addEventListener('click', toggleProductAction);
  button.addEventListener('click', toggleProductAction);
});

function prepareBadgeShine() {
  document.querySelector('.gallery__badges').classList.add('is-ready');
}
if (document.readyState === 'complete') prepareBadgeShine();
else window.addEventListener('load', prepareBadgeShine, { once: true });

const gallery = document.querySelector('.gallery__main');
const galleryImage = document.querySelector('.gallery__image');
const magnifier = document.querySelector('.magnifier');
const magnifierContent = document.querySelector('.magnifier__content');
const thumbnails = document.querySelectorAll('.gallery__thumbs button[data-image]');

function updateMagnifierImage() {
  magnifierContent.replaceChildren(document.querySelector('.gallery__photo').cloneNode(true));
}

updateMagnifierImage();

function positionMagnifier(event) {
  const rect = gallery.getBoundingClientRect();
  const radius = magnifier.clientWidth / 2;
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

  magnifier.style.left = `${x}px`;
  magnifier.style.top = `${y}px`;
  magnifierContent.style.transform = `translate(${radius - x * 2}px, ${radius - y * 2}px) scale(2)`;
}

gallery.addEventListener('pointerenter', positionMagnifier);
gallery.addEventListener('pointermove', positionMagnifier);

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => {
    thumbnails.forEach((item) => item.classList.remove('active'));
    thumbnail.classList.add('active');
    galleryImage.src = thumbnail.dataset.image;
    galleryImage.dataset.original = String(thumbnail === thumbnails[0]);
    updateMagnifierImage();
    galleryImage.addEventListener('load', updateMagnifierImage, { once: true });
  });
});

const searchInput = document.querySelector('.search-field input');
const searchClear = document.querySelector('.search-clear');
searchInput.addEventListener('input', () => {
  searchClear.hidden = !searchInput.value;
});
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.hidden = true;
  searchInput.focus();
});

const stickyHeader = document.querySelector('.HEADER');
const itemHeader = document.querySelector('.item-header');
const backToTop = document.querySelector('.back-to-top');
const galleryBlock = document.querySelector('.gallery');
function updateHeaderShadow() {
  stickyHeader.classList.toggle('is-stuck', window.scrollY >= 62);
  const showItem = galleryBlock.getBoundingClientRect().bottom <= stickyHeader.getBoundingClientRect().bottom;
  itemHeader.hidden = !showItem;
  itemHeader.inert = !showItem;
  backToTop.hidden = !showItem;
  stickyHeader.classList.toggle('has-item-header', showItem);
}
let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateHeaderShadow();
    scrollFrame = 0;
  });
}, { passive: true });
updateHeaderShadow();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
window.addEventListener('resize', () => { updateMagnifierImage(); updateHeaderShadow(); });

const widthInput = document.querySelector('#width');
const lengthInput = document.querySelector('#length');
const totalArea = document.querySelector('#total-area');
const totalPrice = document.querySelector('.total strong');

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function setArea(value) {
  const safeValue = Number.isFinite(value) ? Math.max(1, Math.round(value * 100) / 100) : 1;
  totalArea.value = safeValue;
  totalPrice.textContent = `${formatPrice(Math.round(safeValue * 2338))} ₽`;
  document.querySelector('.item-header__price strong').textContent = totalPrice.textContent;
}

function calculateArea() {
  [widthInput, lengthInput].forEach((input) => {
    const value = Number(input.value);
    if (!Number.isFinite(value) || value < 1) input.value = 1;
  });
  setArea(Number(widthInput.value) * Number(lengthInput.value));
}

widthInput.addEventListener('input', calculateArea);
lengthInput.addEventListener('input', calculateArea);
totalArea.addEventListener('input', () => setArea(Number(totalArea.value)));
document.querySelector('.quantity-btn--minus').addEventListener('click', () => setArea(Number(totalArea.value) - 1));
document.querySelector('.quantity-btn--plus').addEventListener('click', () => setArea(Number(totalArea.value) + 1));

const tabButtons = document.querySelectorAll('.tabs [data-tab]');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabs = document.querySelector('.tabs');
const preferredTabWidths = [290, 86, 191, 90, 109, 92, 81];

function fitTabs() {
  const gap = Number.parseFloat(getComputedStyle(tabs).columnGap) || 0;
  const available = Math.max(0, tabs.clientWidth - gap * (tabButtons.length - 1));
  let low = 0;
  let high = Math.max(...preferredTabWidths);
  for (let iteration = 0; iteration < 24; iteration++) {
    const cap = (low + high) / 2;
    const required = preferredTabWidths.reduce((sum, width) => sum + Math.min(width, cap), 0);
    if (required > available) high = cap;
    else low = cap;
  }
  tabButtons.forEach((button, index) => {
    const width = Math.min(preferredTabWidths[index], low);
    button.style.width = `${Math.round(width * 1000) / 1000}px`;
    button.title = button.textContent.trim();
  });
}

new ResizeObserver(fitTabs).observe(tabs);
fitTabs();

function activateTab(tabId, scrollIntoView = false) {
  const selectedButton = document.querySelector(`.tabs [data-tab="${tabId}"]`);
  const selectedPanel = document.getElementById(tabId);
  if (!selectedButton || !selectedPanel) return;

  tabButtons.forEach((button) => {
    const isActive = button === selectedButton;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel !== selectedPanel;
  });

  if (scrollIntoView) {
    document.querySelector('.tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});

const faqItems = [...document.querySelectorAll('.faq-item')];
const faqAnimations = new WeakMap();

function setFaqExpanded(item, expanded) {
  const answer = item.querySelector('.faq-answer');
  const currentHeight = item.open ? answer.getBoundingClientRect().height : 0;
  const currentOpacity = item.open ? Number(getComputedStyle(answer).opacity) : 0;
  faqAnimations.get(item)?.cancel();
  item.dataset.expanded = String(expanded);
  item.querySelector('summary').setAttribute('aria-expanded', String(expanded));
  answer.setAttribute('aria-hidden', String(!expanded));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    item.open = expanded;
    faqAnimations.delete(item);
    return;
  }

  item.open = true;
  const animation = answer.animate([
    { height: `${currentHeight}px`, opacity: currentOpacity },
    { height: `${expanded ? answer.scrollHeight : 0}px`, opacity: expanded ? 1 : 0 },
  ], { duration: 220, easing: 'cubic-bezier(.2,0,0,1)', fill: 'both' });
  faqAnimations.set(item, animation);
  animation.onfinish = () => {
    if (faqAnimations.get(item) !== animation) return;
    item.open = expanded;
    animation.cancel();
    faqAnimations.delete(item);
  };
}

faqItems.forEach((item, index) => {
  const paragraph = item.querySelector('p');
  const answer = document.createElement('div');
  answer.className = 'faq-answer';
  answer.id = `faq-answer-${index + 1}`;
  paragraph.replaceWith(answer);
  answer.append(paragraph);
  item.open = index === 0;
  item.dataset.expanded = String(item.open);
  answer.setAttribute('aria-hidden', String(!item.open));
  const summary = item.querySelector('summary');
  summary.setAttribute('aria-controls', answer.id);
  summary.setAttribute('aria-expanded', String(item.open));
  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const expanded = item.dataset.expanded !== 'true';
    if (expanded) {
      faqItems.forEach((other) => {
        if (other !== item && other.dataset.expanded === 'true') setFaqExpanded(other, false);
      });
    }
    setFaqExpanded(item, expanded);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const tabId = link.getAttribute('href').slice(1);
    if (document.getElementById(tabId)?.classList.contains('tab-panel')) {
      event.preventDefault();
      activateTab(tabId, true);
    }
  });
});

