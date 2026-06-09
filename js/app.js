const screens = [...document.querySelectorAll("[data-screen]")];
const header = document.querySelector("[data-header]");
const navTriggers = [...document.querySelectorAll("[data-nav]")];

let checkinDone = false;

const resources = {
  oxygen: {
    label: "OxigÃªnio",
    value: "87%",
    color: "#79CDBF",
    text: "#071015",
    bg: "url('../assets/backgrounds/oxygen.png')",
    rate: "âˆ’2.3% /h",
    time: "~18h no nÃ­vel atual",
    rec: [
      "seu treino Ã s 21h usa +8% â€” considere Ã s 18h",
      "aquecedor ligado desde 14h â€” acima do padrÃ£o",
      "pico em 40min coincide com seu horÃ¡rio habitual"
    ],
    bars: [46,50,55,57,60,62,64,67,66,69,70,72,74,75,76,78,79,81,82,83,84,85,86,87]
  },
  water: {
    label: "Ãgua",
    value: "62%",
    color: "#5FA2D3",
    text: "#081015",
    bg: "url('../assets/backgrounds/water.png')",
    rate: "âˆ’0.8% /h",
    time: "~33h no nÃ­vel atual",
    rec: [
      "consumo dentro do padrÃ£o do ciclo atual",
      "filtro de reaproveitamento operando a 94%",
      "reserva de seguranÃ§a em nÃ­vel adequado"
    ],
    bars: [48,50,52,53,54,56,57,58,59,60,61,62,60,59,61,62,63,62,61,60,61,62,62,62]
  },
  food: {
    label: "Alimentos",
    value: "45%",
    color: "#77AA66",
    text: "#071015",
    bg: "url('../assets/backgrounds/food.png')",
    rate: "âˆ’3.1% /h",
    time: "~9h no nÃ­vel atual",
    rec: [
      "jantar Ã s 20h em risco â€” nÃ­vel abaixo de 50%",
      "produÃ§Ã£o hidropÃ´nica do mÃ³dulo D em crescimento",
      "redistribua reservas do mÃ³dulo A"
    ],
    bars: [63,61,59,58,56,55,54,52,51,50,49,48,47,46,45,44,43,42,43,44,45,45,45,45]
  },
  energy: {
    label: "Energia",
    value: "28%",
    color: "#FFE176",
    text: "#0D0F14",
    bg: "url('../assets/backgrounds/energy.png')",
    rate: "âˆ’4.2% /h",
    time: "~7h no nÃ­vel atual",
    rec: [
      "fase noturna ativa â€” sem captaÃ§Ã£o solar por 14h",
      "mÃ³dulo C em consumo elevado â€” redistribuiÃ§Ã£o recomendada",
      "priorize sistemas de suporte de vida"
    ],
    bars: [72,69,66,63,60,57,54,51,48,45,42,39,36,34,32,30,28,27,27,28,28,28,28,28]
  }
};

function setActiveIcon(id) {
  const activeMap = {
    hub: "hub",
    dashboard: "hub",
    resource: "hub",
    checkin: "hub",
    therapy: "hub",
    notifications: "notifications",
    settings: "settings",
    profile: "profile",
    login: ""
  };

  const activeId = activeMap[id] || "";

  navTriggers.forEach((button) => {
    const isActive = button.dataset.nav === activeId && activeId !== "";
    button.toggleAttribute("aria-current", isActive);
    button.dataset.active = isActive ? "true" : "false";
  });
}

function navigate(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });

  if (header) {
    header.hidden = id === "login";
  }

  setActiveIcon(id);
  window.scrollTo(0, 0);

  if (id !== "checkin") {
    document.querySelector("[data-checkin-a]")?.classList.remove("is-hidden");
    document.querySelector("[data-checkin-card]")?.classList.remove("is-open");
  }
}

function openResource(key) {
  const item = resources[key] || resources.energy;
  const detail = document.querySelector("[data-resource-detail]");
  const history = document.querySelector("[data-history]");

  detail.style.setProperty("--detail", item.color);
  detail.style.setProperty("--detailText", item.text);
  detail.style.setProperty("--detailBg", "none");
  document.querySelector("#resource")?.style.setProperty("--resource-page-bg", item.bg);

  document.querySelector("[data-detail-label]").textContent = item.label;
  document.querySelector("[data-detail-value]").textContent = item.value;
  document.querySelector("[data-detail-meter]").style.width = item.value;
  document.querySelector("[data-rate]").textContent = item.rate;
  document.querySelector("[data-time]").textContent = item.time;
  document.querySelector("[data-rec-1]").textContent = item.rec[0];
  document.querySelector("[data-rec-2]").textContent = item.rec[1];
  document.querySelector("[data-rec-3]").textContent = item.rec[2];

  history.innerHTML = item.bars
    .map((height) => `<span style="height:${Math.max(height, 22)}%"></span>`)
    .join("");

  navigate("resource");
}

function markCheckinDone() {
  checkinDone = true;

  const card = document.querySelector("#checkin-hub-card");
  const badge = document.querySelector("#checkin-badge");
  const icon = document.querySelector("#hub-checkin-icon");

  card?.classList.remove("hub-card--pending");
  card?.classList.add("hub-card--done");

  if (badge) {
    badge.className = "badge badge--ok";
    badge.textContent = "âœ“ feito";
  }

  if (icon) {
    icon.classList.remove("icon-red");
    icon.classList.add("icon-green");
  }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.nav);
    return;
  }

  const resource = event.target.closest("[data-resource]");
  if (resource) {
    event.preventDefault();
    openResource(resource.dataset.resource);
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target.closest("[role='button'][data-nav], [role='button'][data-resource]");
  if (!target || !["Enter", " "].includes(event.key)) return;

  event.preventDefault();

  if (target.dataset.nav) navigate(target.dataset.nav);
  if (target.dataset.resource) openResource(target.dataset.resource);
});

document.querySelector("[data-open-checkin]")?.addEventListener("click", () => {
  document.querySelector("[data-checkin-a]")?.classList.add("is-hidden");
  document.querySelector("[data-checkin-card]")?.classList.add("is-open");
});

document.querySelector("[data-checkin-card]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  markCheckinDone();
  navigate("hub");
});

const touchedRanges = new Set();

document.querySelectorAll("[data-checkin-card] input[type='range']").forEach((range, index) => {
  range.addEventListener("input", () => {
    touchedRanges.add(index);

    if (touchedRanges.size === 3) {
      window.setTimeout(() => {
        document.querySelector("[data-checkin-card]")?.requestSubmit();
      }, 350);
    }
  });
});

navigate("login");


/* background states */
function syncCheckinBackground(){
  const checkin = document.getElementById('checkin');
  if(!checkin) return;

  checkin.classList.remove('checkin-a-active','checkin-b-active');

  const card = checkin.querySelector('.checkin-card');
  if(card && !card.classList.contains('is-hidden')){
    if(card.classList.contains('is-open')){
      checkin.classList.add('checkin-b-active');
    } else {
      checkin.classList.add('checkin-a-active');
    }
  }
}

setInterval(syncCheckinBackground, 100);

setActiveIcon("login");
