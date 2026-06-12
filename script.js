const whatsappNumber = "5491150410487";

const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const form = document.querySelector("#quote-form");
const revealItems = document.querySelectorAll(".reveal");

function setMenu(open) {
  document.body.classList.toggle("nav-open", open);
  navToggle?.setAttribute("aria-expanded", String(open));
  navToggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

navToggle?.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("nav-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

function showFieldError(field, message) {
  const label = field.closest("label");
  const small = label?.querySelector("small");

  label?.classList.toggle("error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));

  if (small) {
    small.textContent = message;
  }
}

function validateField(field) {
  const value = field.value.trim();
  let message = "";

  if (field.validity.valueMissing) {
    message = "Completá este campo.";
  } else if (field.validity.tooShort) {
    message = `Ingresá al menos ${field.minLength} caracteres.`;
  } else if (field.validity.patternMismatch) {
    message = "Ingresá un teléfono válido.";
  }

  if (field.name === "telefono" && value && value.replace(/\D/g, "").length < 8) {
    message = "Ingresá un teléfono válido.";
  }

  showFieldError(field, message);
  return !message;
}

form?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input, textarea")];
  const results = fields.map(validateField);
  const isValid = results.every(Boolean);

  if (!isValid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  const data = new FormData(form);
  const message = [
    "Hola, quiero solicitar un presupuesto para un flete o mudanza.",
    `Nombre: ${data.get("nombre")}`,
    `Teléfono: ${data.get("telefono")}`,
    `Origen: ${data.get("origen")}`,
    `Destino: ${data.get("destino")}`,
    `Mensaje: ${data.get("mensaje")}`,
  ].join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
