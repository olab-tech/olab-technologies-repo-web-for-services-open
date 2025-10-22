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
