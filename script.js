/* =========================================================
   E´lixir — Interacciones (violeta + blanco)
   ========================================================= */

/* WhatsApp destino para presupuesto/consulta */
const WHATSAPP = "5491100000000";

/* Año */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Menú mobile */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

const closeNav = () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeNav();
});

/* Revelado al scroll */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 5) * 80}ms`;
    observer.observe(el);
  });
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

/* Filtros galería */
const filters = document.querySelectorAll(".filter");
const tiles = document.querySelectorAll(".tile[data-cat]");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;

    tiles.forEach((tile) => {
      const cat = tile.dataset.cat;
      if (filter === "all" || cat === filter) {
        tile.classList.remove("is-hidden");
      } else {
        tile.classList.add("is-hidden");
      }
    });
  });
});

/* Formulario → WhatsApp */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const fecha = document.getElementById("fecha");

if (fecha) {
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  fecha.min = iso;
}

const marcarError = (input, hayError) => {
  input.classList.toggle("error", hayError);
  if (hayError) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
};

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = form.nombre;
    const telefono = form.telefono;
    const campos = [nombre, telefono, fecha, form.hora, form.evento, form.personas];
    let valido = true;

    campos.forEach((campo) => {
      const vacio = !campo.value || !campo.value.toString().trim();
      marcarError(campo, vacio);
      if (vacio) valido = false;
    });

    if (!valido) {
      status.textContent = "Completá los campos obligatorios para que podamos armar tu presupuesto.";
      form.querySelector(".error")?.focus();
      return;
    }

    const fechaTexto = fecha.value
      ? new Date(fecha.value + "T00:00:00").toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "";

    const mensaje = [
      "¡Hola E´lixir! Quiero pedir presupuesto para mi evento.",
      "",
      `Nombre: ${nombre.value.trim()}`,
      `WhatsApp: ${telefono.value.trim()}`,
      form.email.value.trim() ? `Email: ${form.email.value.trim()}` : "",
      `Tipo de evento: ${form.evento.value}`,
      `Invitados: ${form.personas.value}`,
      fechaTexto ? `Fecha: ${fechaTexto}` : "",
      `Hora de inicio: ${form.hora.value}`,
      form.mensaje.value.trim() ? `Detalles: ${form.mensaje.value.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener");
    status.textContent = "Se abrió WhatsApp con tu consulta. Enviá el mensaje para recibir tu presupuesto.";
    form.reset();
    if (fecha) {
      const today = new Date();
      const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      fecha.min = iso;
    }
    form.querySelectorAll("input, select, textarea").forEach((campo) => marcarError(campo, false));
  });

  form.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.addEventListener("input", () => marcarError(campo, false));
    campo.addEventListener("change", () => marcarError(campo, false));
  });
}
