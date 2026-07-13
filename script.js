const yesBtn = document.querySelector("#yes-btn");
const noBtn = document.querySelector("#no-btn");
const questionPanel = document.querySelector("#question-panel");
const dateForm = document.querySelector("#date-form");
const song = document.querySelector("#song");
const result = document.querySelector("#result");
const actionsBox = document.querySelector(".actions");
const whatsappNumber = "573108853158";
const noButtonState = {
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

function keepInsideBox(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getMoveBounds() {
  const rect = noBtn.getBoundingClientRect();
  const boxRect = actionsBox.getBoundingClientRect();
  const boxCenterX = boxRect.left + boxRect.width / 2;
  const boxCenterY = boxRect.top + boxRect.height / 2;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const naturalOffsetX = centerX - noButtonState.x - boxCenterX;
  const naturalOffsetY = centerY - noButtonState.y - boxCenterY;

  return {
    rect,
    maxOffsetX: Math.max(0, boxRect.width / 2 - rect.width / 2 - Math.abs(naturalOffsetX) - 10),
    maxOffsetY: Math.max(0, boxRect.height / 2 - rect.height / 2 - Math.abs(naturalOffsetY) - 10),
  };
}

function applyNoButtonPosition() {
  noBtn.classList.add("is-running");
  noBtn.style.transform = `translate(${noButtonState.x}px, ${noButtonState.y}px) rotate(-2deg)`;
}

function moveNoButton(event) {
  const { rect, maxOffsetX, maxOffsetY } = getMoveBounds();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const pointerX = event.clientX;
  const pointerY = event.clientY;

  if (typeof pointerX !== "number" || typeof pointerY !== "number") return;

  const distanceX = centerX - pointerX;
  const distanceY = centerY - pointerY;
  const distance = Math.hypot(distanceX, distanceY);
  const dangerZone = 130;

  if (distance > dangerZone) return;

  const safeDistance = Math.max(distance, 1);
  const push = 42;
  const drift = 8;

  noButtonState.x += (distanceX / safeDistance) * push + (Math.random() * drift - drift / 2);
  noButtonState.y += (distanceY / safeDistance) * push + (Math.random() * drift - drift / 2);
  noButtonState.x = keepInsideBox(noButtonState.x, -maxOffsetX, maxOffsetX);
  noButtonState.y = keepInsideBox(noButtonState.y, -maxOffsetY, maxOffsetY);

  applyNoButtonPosition();
}

function jumpNoButtonOnTap(event) {
  event.preventDefault();
  const { maxOffsetX, maxOffsetY } = getMoveBounds();
  const minJump = 34;
  let nextX = noButtonState.x;
  let nextY = noButtonState.y;

  if (maxOffsetX > minJump) {
    nextX = Math.random() > 0.5 ? maxOffsetX : -maxOffsetX;
  }

  if (maxOffsetY > minJump) {
    nextY = Math.random() > 0.5 ? maxOffsetY : -maxOffsetY;
  }

  noButtonState.x = nextX;
  noButtonState.y = nextY;
  applyNoButtonPosition();
}

function blockNoClick(event) {
  event.preventDefault();
  jumpNoButtonOnTap(event);
}

yesBtn.addEventListener("click", showForm);
window.addEventListener("pointermove", moveNoButton);
noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("click", blockNoClick);
noBtn.addEventListener("pointerdown", blockNoClick);
window.addEventListener("resize", () => {
  noButtonState.x = 0;
  noButtonState.y = 0;
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
