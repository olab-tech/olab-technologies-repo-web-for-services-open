// ===== Menu Data =====
const menuItems = [
  { name: "Custom Web Development", href: "#" },
  { name: "Shopify E-commerce", href: "#" },
  { name: "Digital Growth", href: "#" },
  { name: "Clients", href: "#" }
];

// ===== Get Elements =====
const desktopMenu = document.getElementById("desktop-menu");
const mobileMenu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const hamburgerIcon = document.getElementById("hamburger-icon");
const closeIcon = document.getElementById("close-icon");
const currentYearSpan = document.getElementById("current-year");

// ===== Generate Desktop Menu =====
desktopMenu.innerHTML = `
  ${menuItems
    .map(
      item =>
        `<a href="${item.href}" class="text-gray-600 hover:text-black transition">${item.name}</a>`
    )
    .join("")}

 <button type="button" 
  class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 
         hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 
         dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
         dark:hover:text-white dark:hover:bg-gray-700">
  Get a Free Quote
</button> `;

// ===== Generate Mobile Menu =====
mobileMenu.innerHTML = `
  ${menuItems
    .map(
      item =>
        `<a href="${item.href}" class="block py-3 px-6 text-gray-600 hover:bg-gray-50">${item.name}</a>`
    )
    .join("")}
  <div class="p-4 space-y-3">
  <button type="button" 
    class="w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 
           hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 
           dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
           dark:hover:text-white dark:hover:bg-gray-700">
    Get a Free Quote
  </button>
</div>`;

// ===== Mobile Menu Toggle =====
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  hamburgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
});

// ===== Auto Year Update =====
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}


// ===== Newsletter Form Submission =====

/*
  1) This example fetches a disposable-domain JSON (hosted via jsDelivr CDN)
     pointing at a GitHub list (e.g. disposable-email-domains). 
  2) If fetch fails (CORS / network), it uses a small embedded fallback list.
  3) Then exposes isDisposable(email) to use in your form validation.
*/

// CDN URL pointing to a repo's JSON file (example: disposable-email-domains/domains.json)
// You should replace the URL with the exact raw/json path you want to use.
// Example (replace owner/repo/path if you prefer another list):
function showFeedback(type, message, elementId = 'feedback') {
  const el = document.getElementById(elementId);
  if (!el) return;
  let color = 'text-gray-400';
  switch (type) {
    case 'success': color = 'text-green-500'; break;
    case 'error': color = 'text-red-500'; break;
    case 'warning': color = 'text-yellow-500'; break;
    case 'info': color = 'text-blue-500'; break;
  }
  el.className = `text-xs mt-2 transition ${color}`;
  el.textContent = message;
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => { el.textContent = ''; }, 4000);
}

// toggleLoader(): global overlay
function toggleLoader(show) {
  const loader = document.getElementById('globalLoader');
  if (!loader) return;
  loader.classList.toggle('hidden', !show);
}

// toggleButtonLoader(): inline loader for submit button
function toggleButtonLoader(show, btnId = 'subscribeBtn') {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector('#btnText');
  const loader = btn.querySelector('#btnLoader');
  if (show) {
    loader.classList.remove('hidden');
    text.classList.add('opacity-50');
    btn.disabled = true;
  } else {
    loader.classList.add('hidden');
    text.classList.remove('opacity-50');
    btn.disabled = false;
  }
}

/* ---------- DISPOSABLE EMAIL CHECKER ---------- */
const CDN_JSON = 'https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@latest/domains.json';
let disposableSet = null;

async function loadDisposableList() {
  const fallback = ['mailinator.com','10minutemail.com','yopmail.com','guerrillamail.com'];
  try {
    const resp = await fetch(CDN_JSON, {cache: 'no-cache'});
    if (!resp.ok) throw new Error('Fetch failed');
    const arr = await resp.json();
    disposableSet = new Set(arr.map(d => d.toLowerCase()));
    console.info('Loaded disposable domains:', disposableSet.size);
  } catch (err) {
    console.warn('Fallback to local disposable list.');
    disposableSet = new Set(fallback);
  }
}
loadDisposableList();

function getDomainFromEmail(email) {
  const at = email.lastIndexOf('@');
  return at === -1 ? null : email.slice(at + 1).toLowerCase();
}

function isDisposable(email) {
  const domain = getDomainFromEmail(email);
  if (!domain || !disposableSet) return false;
  if (disposableSet.has(domain)) return true;
  const parts = domain.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join('.');
    if (disposableSet.has(candidate)) return true;
  }
  if (/^\d+$/.test(domain.split('.')[0])) return true;
  return false;
}

/* ---------- FORM HANDLER ---------- */
document.getElementById('newsletterForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = (document.getElementById('email').value || '').trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  toggleButtonLoader(true);
  toggleLoader(true);
  showFeedback('info', 'Checking email...');

  await new Promise(resolve => setTimeout(resolve, 800)); // small delay for effect

  // 1️⃣ Validate syntax
  if (!re.test(email)) {
    toggleButtonLoader(false);
    toggleLoader(false);
    showFeedback('error', '⚠️ Please enter a valid email address.');
    return;
  }

  // 2️⃣ Check disposable
  if (isDisposable(email)) {
    toggleButtonLoader(false);
    toggleLoader(false);
    showFeedback('warning', '🚫 Disposable email detected. Please use a permanent one.');
    return;
  }

  // 3️⃣ Simulate submission success
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay
  toggleButtonLoader(false);
  toggleLoader(false);
  showFeedback('success', '✅ Thank you for subscribing!');

  console.log('Accepted email:', email);
  document.getElementById('email').value = ''; // clear input
});




// dynamic feedback function

/**
 * Displays feedback messages in a unified, styled way.
 * @param {string} type - "success", "error", "warning", or "info"
 * @param {string} message - The message text to display
 * @param {string} [elementId='feedback'] - Optional: ID of target feedback element
 */
function showFeedback(type, message, elementId = 'feedback') {
    const el = document.getElementById(elementId);
    if (!el) return console.warn('⚠️ Feedback element not found:', elementId);

    // Base classes for all messages
    let classes = "text-xs mt-2 transition duration-200 ";

    switch (type) {
        case "success":
            classes += "text-green-500";
            break;
        case "error":
            classes += "text-red-500";
            break;
        case "warning":
            classes += "text-yellow-500";
            break;
        case "info":
            classes += "text-blue-500";
            break;
        default:
            classes += "text-gray-400";
    }

    el.className = classes;
    el.textContent = message;

    // Optional: auto-hide after 5 seconds
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
        el.textContent = "";
    }, 5000);
}

// global loader toggle function
/**
 * Show or hide the global loader overlay
 * @param {boolean} show - true = show loader, false = hide loader
 */
function toggleLoader(show) {
    const loader = document.getElementById('globalLoader');
    if (!loader) return console.warn('⚠️ Loader element not found');
    loader.classList.toggle('hidden', !show);
}

/**
 * Example helper to simulate async operation
 */
async function simulateSubmission() {
    toggleLoader(true);
    showFeedback("info", "Submitting...");

    // simulate 2-second API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    toggleLoader(false);
    showFeedback("success", "✅ Submission complete!");
}

// --- Infinite Logo Marquee ---

// 1. Create a new <style> element
const style = document.createElement('style');

// 2. Define the CSS animation keyframes and a class to use them
//    This is the same CSS that would have been generated by the tailwind.config.js file
style.innerHTML = `
    @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
    }
    .animate-marquee-js {
        animation: marquee 30s linear infinite;
    }
`;

// 3. Add the new styles to the document's <head>
document.head.appendChild(style);

// 4. Find the marquee content element by its ID and add the animation class
const marqueeContent = document.getElementById('marquee-content');
if (marqueeContent) {
    marqueeContent.classList.add('animate-marquee-js');
}


// ===== Resource Filtering Logic =====
    document.addEventListener('DOMContentLoaded', function () {
        const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
        const resourceCards = document.querySelectorAll('#resource-grid .resource-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                resourceCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });