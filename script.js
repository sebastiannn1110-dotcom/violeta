const yesBtn = document.querySelector("#yes-btn");
const noBtn = document.querySelector("#no-btn");
const questionPanel = document.querySelector("#question-panel");
const dateForm = document.querySelector("#date-form");
const song = document.querySelector("#song");
const result = document.querySelector("#result");
const whatsappNumber = "573108853158";
const noButtonState = {
  initialized: false,
  x: 0,
  y: 0,
};

function tryPlaySong() {
  song.play().catch(() => {
    // Browsers can block autoplay; the visible controls still let her start it.
  });
}

function showForm() {
  questionPanel.hidden = true;
  dateForm.hidden = false;
  tryPlaySong();
  dateForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function keepInsideViewport(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function placeNoButton() {
  if (noButtonState.initialized) return;

  const rect = noBtn.getBoundingClientRect();
  noButtonState.x = rect.left;
  noButtonState.y = rect.top;
  noButtonState.initialized = true;
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;
  noBtn.classList.add("is-running");
  noBtn.style.width = `${buttonWidth}px`;
  noBtn.style.height = `${buttonHeight}px`;
  noBtn.style.left = `${noButtonState.x}px`;
  noBtn.style.top = `${noButtonState.y}px`;
}

function moveNoButton(event) {
  placeNoButton();

  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const pointerX = event.clientX ?? centerX;
  const pointerY = event.clientY ?? centerY;
  const distanceX = centerX - pointerX;
  const distanceY = centerY - pointerY;
  const distance = Math.hypot(distanceX, distanceY);
  const dangerZone = 145;

  if (distance > dangerZone) return;

  const padding = 18;
  const maxLeft = window.innerWidth - rect.width - padding;
  const maxTop = window.innerHeight - rect.height - padding;
  const safeDistance = Math.max(distance, 1);
  const push = 82;
  const drift = 16;

  noButtonState.x += (distanceX / safeDistance) * push + (Math.random() * drift - drift / 2);
  noButtonState.y += (distanceY / safeDistance) * push + (Math.random() * drift - drift / 2);
  noButtonState.x = keepInsideViewport(noButtonState.x, padding, maxLeft);
  noButtonState.y = keepInsideViewport(noButtonState.y, padding, maxTop);

  noBtn.style.left = `${noButtonState.x}px`;
  noBtn.style.top = `${noButtonState.y}px`;
  noBtn.style.transform = "rotate(-2deg)";
}

function blockNoClick(event) {
  event.preventDefault();
  moveNoButton(event);
}

yesBtn.addEventListener("click", showForm);
window.addEventListener("pointermove", moveNoButton);
noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("click", blockNoClick);
noBtn.addEventListener("pointerdown", blockNoClick);
noBtn.addEventListener("focus", moveNoButton);
window.addEventListener("resize", () => {
  noButtonState.initialized = false;
  noBtn.classList.remove("is-running");
  noBtn.removeAttribute("style");
});

dateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(dateForm);
  const plan = formData.get("plan");
  const date = formData.get("date");
  const message = `Hola, sí quiero salir. Elijo: ${plan}. Fecha: ${date}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  result.textContent = "Listo, abriendo WhatsApp con tu elección.";
  tryPlaySong();
  window.location.href = whatsappUrl;
});
