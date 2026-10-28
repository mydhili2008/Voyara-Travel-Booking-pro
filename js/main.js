const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const transportNames = { flight: "Flights", train: "Trains", bus: "Buses", ship: "Ships" };
let currentMode = "flight";
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// Set the date input to today, using the visitor's local date.
const dateInput = $("#departDate");
const localToday = new Date();
dateInput.min = `${localToday.getFullYear()}-${String(localToday.getMonth()+1).padStart(2,"0")}-${String(localToday.getDate()).padStart(2,"0")}`;
dateInput.value = dateInput.min;

// Mobile navigation
const menuToggle = $(".menu-toggle");
const nav = $(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Transport tabs
function setTransport(mode) {
  currentMode = mode;
  $$(".transport-tab").forEach(tab => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}
$$(".transport-tab").forEach(tab => tab.addEventListener("click", () => setTransport(tab.dataset.mode)));
$$("[data-pick]").forEach(button => button.addEventListener("click", () => {
  setTransport(button.dataset.pick);
  $("#booking").scrollIntoView({ behavior: "smooth" });
}));

$("#swapBtn").addEventListener("click", () => {
  const origin = $("#origin");
  const destination = $("#destination");
  [origin.value, destination.value] = [destination.value, origin.value];
  destination.focus();
});

const sampleOptions = {
  flight: [
    { provider: "Voyara Air", title: "Direct journey", detail: "Approx. 1h 35m · Economy", price: 4599 },
    { provider: "Skyline Connect", title: "Flexible fare", detail: "Approx. 2h 10m · 1 stop", price: 3899 },
    { provider: "Horizon Airways", title: "Comfort fare", detail: "Approx. 1h 50m · Economy", price: 5299 }
  ],
  train: [
    { provider: "Coastal Express", title: "Scenic route", detail: "Approx. 8h 20m · Reserved", price: 899 },
    { provider: "Intercity Rail", title: "Day journey", detail: "Approx. 7h 45m · Chair car", price: 1299 },
    { provider: "Nightline Rail", title: "Overnight journey", detail: "Approx. 9h · Sleeper", price: 1499 }
  ],
  bus: [
    { provider: "GreenRoad", title: "Premium coach", detail: "Approx. 9h · AC sleeper", price: 1099 },
    { provider: "Roadbird Express", title: "Comfort coach", detail: "Approx. 10h · AC seater", price: 799 },
    { provider: "Night Owl Travels", title: "Night service", detail: "Approx. 8h 45m · Sleeper", price: 1299 }
  ],
  ship: [
    { provider: "Blue Horizon", title: "Coastal sailing", detail: "Illustrative route · Cabin class", price: 6499 },
    { provider: "Ocean Passage", title: "Sea-view journey", detail: "Illustrative route · Standard cabin", price: 8299 },
    { provider: "Island Link", title: "Island connection", detail: "Illustrative route · Standard seat", price: 2799 }
  ]
};

function formatDate(value) {
  if (!value) return "Selected date";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  const from = $("#origin").value.trim();
  const to = $("#destination").value.trim();
  const date = $("#departDate").value;
  if (!from || !to) return showToast("Enter both your starting point and destination.");
  if (from.toLowerCase() === to.toLowerCase()) return showToast("Choose two different places for your journey.");

  const results = $("#searchResults");
  const options = sampleOptions[currentMode];
  results.innerHTML = `
    <div class="results-title">
      <div><p class="eyebrow">SAMPLE JOURNEYS · ${transportNames[currentMode].toUpperCase()}</p>
      <h3>${escapeHtml(from)} <span aria-hidden="true">→</span> ${escapeHtml(to)}</h3></div>
      <span class="muted small">${formatDate(date)}</span>
    </div>
    <p class="demo-note">Illustrative results only. These prices and services are examples, not bookable live inventory.</p>
    <div class="result-list">${options.map((item, index) => `
      <article class="result-card">
        <span class="result-mode">${transportNames[currentMode].toUpperCase()} · OPTION 0${index+1}</span>
        <h4>${item.provider}</h4><p>${item.title} · ${item.detail}</p>
        <div class="result-bottom"><strong>₹${item.price.toLocaleString("en-IN")}</strong><button type="button" data-demo-book="${escapeHtml(item.provider)}">Select</button></div>
      </article>`).join("")}</div>`;
  results.classList.add("visible");
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  $$("[data-demo-book]", results).forEach(button => button.addEventListener("click", () => {
    showToast(`${button.dataset.demoBook} is a sample option. Connect a real provider API to enable bookings.`);
  }));
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

// Lightweight parallax, disabled for reduced motion. Uses requestAnimationFrame for scroll work.
const heroImage = $(".hero-image");
const quoteBg = $(".quote-bg");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;
function updateParallax() {
  if (!reducedMotion) {
    const y = window.scrollY;
    if (heroImage) heroImage.style.transform = `scale(1.08) translate3d(0, ${Math.min(y * 0.12, 80)}px, 0)`;
    if (quoteBg) {
      const rect = quoteBg.parentElement.getBoundingClientRect();
      quoteBg.style.transform = `scale(1.04) translate3d(0, ${Math.max(-30, Math.min(30, -rect.top * 0.06))}px, 0)`;
    }
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });
updateParallax();

// Reveal elements on scroll
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(element => observer.observe(element));
} else {
  $$(".reveal").forEach(element => element.classList.add("in-view"));
}

// Demo currency control
$("#currencyBtn").addEventListener("click", () => showToast("This concept currently displays prices in INR (₹)."));

// Newsletter demo
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#email").value.trim();
  if (!email) return;
  $("#newsletterMessage").textContent = "Thanks! Newsletter signup is a frontend demo.";
  $("#email").value = "";
});

// Ensure reveal elements don't remain hidden if JS starts after initial paint.
window.addEventListener("load", () => {
  if (!("IntersectionObserver" in window) || reducedMotion) $$(".reveal").forEach(el => el.classList.add("in-view"));
});
