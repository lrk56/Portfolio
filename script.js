// Simple section switching based on the URL hash (#about, #physical, #digital, #contact).
// To add a section: add a <section id="x" class="page-section hidden"> in index.html
// and a nav link with href="#x" and data-nav="x".

const sections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-link');
const DEFAULT_SECTION = 'about';

function showSection(id) {
  const el = document.getElementById(id);
  const parent = el ? el.closest('.page-section') : null; // the page this element lives on
  const target = parent ? parent.id : DEFAULT_SECTION;

  sections.forEach((section) => {
    section.classList.toggle('hidden', section.id !== target);
  });

  // Highlight the nav link matching the hash (e.g. Contact), else the page's own link
  const hasOwnLink = [...navLinks].some((link) => link.dataset.nav === id);
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === (hasOwnLink ? id : target));
  });

  // If the hash points inside a page (like #contact), scroll down to it
  if (el && el !== parent) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function handleHash() {
  showSection(window.location.hash.slice(1) || DEFAULT_SECTION);
}

window.addEventListener('hashchange', handleHash);
handleHash();

// ---------- Typewriter effect for the title ----------
const title = document.querySelector('.title');
const fullText = title.textContent.trim();
const TYPING_SPEED = 200; // milliseconds per letter, so lower is faster

// JavaScript version of RandomHexColor.py: a random integer up to 0xFFFFFF,
// formatted as a 6-digit hex string padded with zeros
// Colors brighter than this (0 = black, 255 = white) get re-rolled so letters stay readable
// on the white background. Lower it to be stricter, raise it to allow lighter colors.
const MAX_BRIGHTNESS = 200;

const COLORS = [
  // greens
  '#1b4332', // pine
  '#2d6a4f', // forest
  '#386641', // deep green
  '#40916c', // jade
  '#4f772d', // fern
  '#52796f', // sage
  '#588157', // clover
  '#6a994e', // moss
  '#5b7f2b', // leaf
  '#4a7c59', // eucalyptus
  '#3a5a40', // spruce
  '#606c38', // olive
  '#708238', // olive drab
  '#7a8b3a', // lichen
  '#3d6b4f', // hunter
  '#2f6f5e', // teal green
  '#556b2f', // dark olive
  '#6b8e23', // grass
  '#33691e', // garden
  '#4c6a2c', // basil
  // rusts and reds
  '#9c3d1b', // rust
  '#b5502c', // terracotta
  '#8c2f1b', // brick
  '#a4442a', // clay
  '#7f3b22', // sienna
  '#a63d2f', // paprika
  // oranges
  '#c8591a', // burnt orange
  '#d9822b', // amber
  '#cc6a2c', // pumpkin
  '#c2702d', // copper
  // yellows
  '#c99a1b', // mustard
  '#b8860b', // goldenrod
  '#a67c00', // ochre
  '#bf9b30', // old gold
];

function generateRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Fonts to pick from (loaded in index.html). Add or remove names freely.
const FONTS = [
  '"DM Mono", monospace',
  '"Pacifico", cursive',
  '"Lobster", cursive',
  '"Playfair Display", serif',
  '"Special Elite", monospace',
  '"Permanent Marker", cursive',
  '"Orbitron", sans-serif',
];

function randomFont() {
  return FONTS[Math.floor(Math.random() * FONTS.length)];
}

// Build one span per letter, each with its own random color and font.
// They start hidden (but take up space) and get revealed one at a time.
title.setAttribute('aria-label', fullText); //screen readers still read the whole name
title.textContent = '';
const letters = [...fullText].map((char) => {
  const span = document.createElement('span');
  span.className = 'letter';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = char;
  span.style.color = generateRandomColor();
  span.style.fontFamily = randomFont();
  title.appendChild(span);
  return span;
});

let i = 0;

function typeNextLetter() {
  if (i < letters.length) {
    letters[i].classList.add('shown');
    i++;
    setTimeout(typeNextLetter, TYPING_SPEED);
  }
}

typeNextLetter();

// ---------- Sub-index (Physical page): click a link to smoothly scroll to that heading ----------
document.querySelectorAll('.sub-link').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---------- Lightbox: click a photo to view it large, with its info underneath ----------
// Click anywhere, the X, or press Esc to close
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');

document.querySelectorAll('.small-photo img, .gallery-photo img').forEach((img) => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    // Paintings: reuse the figure's own caption. Photography: use its data-caption text.
    const figcaption = img.closest('figure').querySelector('figcaption');
    if (figcaption) {
      lightboxCaption.innerHTML = figcaption.innerHTML;
    } else {
      lightboxCaption.textContent = img.dataset.caption || '';
    }

    lightbox.classList.remove('hidden');
  });
});

function closeLightbox() {
  lightbox.classList.add('hidden');
}

lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
// ---------- Random photo strip (About page) ----------
// Picks random photos from the Physical page, fades them in one by one,
// and jumps to the real photo when you click one.
const STRIP_COUNT = 10;      // how many photos to show
const STRIP_DELAY = 350;     // milliseconds between each photo appearing

const strip = document.getElementById('random-strip');
// Which photos to pick from. Use '.gallery-photo img' alone for photography only.
const allPhotos = [...document.querySelectorAll('.small-photo img, .gallery-photo img')];

function shuffle(list) {
  for (let n = list.length - 1; n > 0; n--) {
    const j = Math.floor(Math.random() * (n + 1));
    [list[n], list[j]] = [list[j], list[n]];
  }
  return list;
}

function goToPhoto(original) {
  showSection('physical');                    // switch to the Physical page
  history.replaceState(null, '', '#physical');
  original.closest('figure').scrollIntoView({ behavior: 'smooth', block: 'center' });
  original.classList.add('photo-flash');      // outline it so you can spot it
  setTimeout(() => original.classList.remove('photo-flash'), 2000);
}

if (strip) {
  const stripItems = shuffle([...allPhotos]).slice(0, STRIP_COUNT).map((original) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'random-photo';
    button.setAttribute('aria-label', 'See this photo in my portfolio');

    const img = document.createElement('img');
    img.src = original.src;
    img.alt = '';
    button.appendChild(img);

    button.addEventListener('click', () => goToPhoto(original));
    strip.appendChild(button);
    return button;
  });

  // Fill in one at a time
  stripItems.forEach((button, index) => {
    setTimeout(() => button.classList.add('shown'), index * STRIP_DELAY);
  });
}