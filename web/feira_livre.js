import * as maplibregl from "https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl.mjs";
import { buffer } from "https://cdn.jsdelivr.net/npm/@turf/buffer@7.2.0/+esm";
import { booleanPointInPolygon } from "https://cdn.jsdelivr.net/npm/@turf/boolean-point-in-polygon@7.2.0/+esm";
import { versao_data, versao_hash, versao_numero } from "./versao.js";

const ORS_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNkZTljYTNjYWE2NjQxYzM5MjBmY2M2N2EwZWIyZjRlIiwiaCI6Im11cm11cjY0In0=";
const MAPTILER_API_KEY = "auHi8tQJGZuSo0I0DjdX";
const MARKER_ICON_BASE_URL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-";
const SAO_PAULO_CENTER = [-46.6333, -23.5505];
const TOLERANCIA_LOCALIZACAO_KILOMETROS = 3;

let userLocation = null;
let localizacaoForaMunicipio = false;
let limiteMunicipioComBuffer = null;
let routeRequestController = null;

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/01a0eaed-547f-7e52-a4b5-94650be7ecfd/style.json?key=${MAPTILER_API_KEY}`,
  center: SAO_PAULO_CENTER,
  zoom: 11,
  attributionControl: false,
});

const dialog = document.getElementById("event-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogDesc = document.getElementById("dialog-description");
const closeBtn = document.getElementById("close-dialog");

closeBtn.addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => {
  routeRequestController?.abort();
  routeRequestController = null;

  const routeSource = map.getSource("route-line");
  if (routeSource) {
    routeSource.setData({ type: "FeatureCollection", features: [] });
  }
});

const scale = new maplibregl.ScaleControl({
  maxWidth: 80,
  unit: "metric",
});
map.addControl(scale);

map.addControl(
  new maplibregl.AttributionControl({
    compact: true,
    customAttribution:
      "© <a href='https://novogeosampa.prefeitura.sp.gov.br/' target='_blank'>GEOSAMPA - CC-BY-SA - 2026</a>",
  }),
);

map.addControl(new maplibregl.NavigationControl(), "top-right");

const geolocateControl = new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: false,
});
map.addControl(geolocateControl, "top-right");

async function carregarLimiteMunicipio() {
  const response = await fetch("data/municipio_sao_paulo.geojson");
  if (!response.ok) {
    throw new Error(`Falha ao carregar limite municipal: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data || typeof data !== "object") {
    throw new Error("O arquivo do limite municipal contém GeoJSON inválido.");
  }

  const feature =
    data.type === "FeatureCollection"
      ? data.features?.[0]
      : data.type === "Feature"
        ? data
        : null;

  const geometry = feature?.geometry;
  if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type)) {
    throw new Error("O arquivo do limite municipal não contém um polígono válido.");
  }

  const limiteMunicipioComBuffer = buffer(
    { type: "Feature", properties: {}, geometry },
    TOLERANCIA_LOCALIZACAO_KILOMETROS,
    { units: "kilometers" },
  );
  if (!limiteMunicipioComBuffer) {
    throw new Error("Não foi possível aplicar a margem ao limite municipal.");
  }

  return limiteMunicipioComBuffer;
}

function estaDentroDoMunicipio(point) {
  return booleanPointInPolygon(
    { type: "Point", coordinates: point },
    limiteMunicipioComBuffer,
  );
}

geolocateControl.on("error", async (e) => {
  console.error("User location error:", e);
  userLocation = null;
  localizacaoForaMunicipio = false;
  showModal(
    "Erro ao obter sua localização",
    "Não foi possível obter sua localização. Por favor, verifique as permissões do navegador.",
  );
});

map.on("load", async () => {
  console.log("Map loaded. Triggering geolocation...");
  console.log("Map style:", map.getStyle());
  console.log("Map layers:", map.getStyle().layers);

  try {
    limiteMunicipioComBuffer = await carregarLimiteMunicipio();
  } catch (error) {
    console.error("Não foi possível carregar o limite do município.", error);
  }

  const icons = [
    {
      id: "icon-red",
      color: "#cb2b3e",
      url: `${MARKER_ICON_BASE_URL}red.png`,
    },
    {
      id: "icon-blue",
      color: "#2a81cb",
      url: `${MARKER_ICON_BASE_URL}blue.png`,
    },
    {
      id: "icon-green",
      color: "#4CAF50",
      url: `${MARKER_ICON_BASE_URL}green.png`,
    },
    {
      id: "icon-gold",
      color: "#FFD700",
      url: `${MARKER_ICON_BASE_URL}gold.png`,
    },
    {
      id: "icon-violet",
      color: "#9932CC",
      url: `${MARKER_ICON_BASE_URL}violet.png`,
    },
    {
      id: "icon-yellow",
      color: "#FFD700",
      url: `${MARKER_ICON_BASE_URL}yellow.png`,
    },
    {
      id: "icon-grey",
      color: "#808080",
      url: `${MARKER_ICON_BASE_URL}grey.png`,
    },
  ];

  function createSvgImage(svgString, width = 32, height = 32) {
    return new Promise((resolve, reject) => {
      const img = new Image(width, height);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };
      img.src = url;
    });
  }

  function createFallbackIcon(color) {
    const canvas = document.createElement("canvas");
    canvas.width = 20;
    canvas.height = 20;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Não foi possível criar o contexto 2D do ícone.");
    }

    context.beginPath();
    context.arc(10, 10, 8, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.stroke();

    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  function getTentSvgString(color = "#E63946") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path fill="${color}" d="M90.9 270.9L67.7 508.9C65.8 527.7 80.6 544 99.5 544L272.2 544C298.7 544 320.2 522.5 320.2 496L320.2 367C320.2 358.7 326.9 352 335.2 352C340.7 352 345.8 355 348.4 359.9L434.5 518.9C442.9 534.4 459.1 544 476.7 544L540.8 544C559.7 544 574.5 527.7 572.6 508.9L549.6 271.1C547.7 251.5 536.8 233.8 520.1 223.3L344.9 112.3C329.2 102.3 309.1 102.4 293.4 112.4L120.1 223.2C103.6 233.8 92.8 251.4 90.9 270.9z"/>
</svg>`;
  }

  for (const icon of icons) {
    try {
      const svgStringWithColor = getTentSvgString(icon.color);
      const img = await createSvgImage(svgStringWithColor, 20, 20);

      map.addImage(icon.id, img);
    } catch (error) {
      console.error(
        `Falha ao criar o ícone ${icon.id}; usando marcador reserva.`,
        error,
      );

      try {
        map.addImage(icon.id, createFallbackIcon(icon.color));
      } catch (fallbackError) {
        console.error(
          `Falha ao registrar o marcador reserva ${icon.id}.`,
          fallbackError,
        );
      }
    }
  }

  const feira_livre_source = map.addSource("feira-livre-data", {
    type: "geojson",
    data: "data/equipamento_feira_livre.geojson",
  });

  console.log("feira-livre-source", feira_livre_source);

  map.addLayer({
    id: "feira-livre-layer",
    type: "symbol",
    source: "feira-livre-data",
    layout: {
      visibility: "visible",

      "icon-image": [
        "match",
        ["get", "tx_dia_funcionamento"],
        "DOMINGO",
        "icon-red",
        "SABADO",
        "icon-blue",
        "SEXTA-FEIRA",
        "icon-green",
        "QUINTA-FEIRA",
        "icon-gold",
        "QUARTA-FEIRA",
        "icon-violet",
        "TERCA-FEIRA",
        "icon-yellow",
        "icon-grey",
      ],
      "icon-size": 1.5,
      "icon-allow-overlap": true,
      "icon-anchor": "bottom",

      "text-field": "{tx_dia_funcionamento} - {nm_equipamento}",
      "text-size": 12,
      "text-offset": [0, 0.5],
      "text-anchor": "top",
      "text-optional": true,
    },
    paint: {
      "text-color": "#333333",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
    },
  });

  console.log("Map layers", map.getStyle().layers[90], map);

  startGeolocation();
  setupInteractions();

  if (limiteMunicipioComBuffer) {
    geolocateControl.trigger();
  } else {
    showModal(
      "Não foi possível validar a localização",
      "O limite do município não foi carregado. Atualize a página para tentar novamente.",
    );
  }
});

function startGeolocation() {
  console.log("Setting up geolocation functionality...", geolocateControl);

  geolocateControl.on("geolocate", async (e) => {
    const location = [e.coords.longitude, e.coords.latitude];
    if (!limiteMunicipioComBuffer) {
      userLocation = null;
      localizacaoForaMunicipio = false;
      showModal(
        "Localização não validada",
        "Não foi possível carregar o limite do município. Atualize a página e tente novamente.",
      );
      return;
    }

    if (!estaDentroDoMunicipio(location)) {
      userLocation = null;
      localizacaoForaMunicipio = true;
      showModal(
        "⚠️ Atenção - Fora do limite do município de São Paulo",
        "Sua localização não se encontra dentro da área do município de São Paulo. O mapa será carregado no centro do município e você poderá visualizar as feiras livres.",
      );
      map.easeTo({ center: SAO_PAULO_CENTER, zoom: 11 });
      return;
    }

    localizacaoForaMunicipio = false;
    userLocation = location;
    console.log("User location obtained:", userLocation);
  });
}

function showModal(titulo, descricao) {
  dialogTitle.textContent = titulo;
  dialogDesc.innerHTML = descricao;
  dialog.showModal();
}

function obterFeatureSelecionada(item) {
  const feature = item.features?.[0];
  const coordinates = feature?.geometry?.coordinates;

  if (
    !feature ||
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    !Number.isFinite(coordinates[0]) ||
    !Number.isFinite(coordinates[1])
  ) {
    return null;
  }

  return feature;
}

function obterValorPropriedade(properties, propertyName, fallback) {
  const value = properties[propertyName];
  return value === undefined || value === null || value === ""
    ? fallback
    : String(value);
}

function escaparHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function setupInteractions() {
  const menuButton = document.getElementById("menu-button");
  const menu = document.getElementById("menu");
  const menuLegendToggle = document.getElementById("menu-legend-toggle");
  const menuLegendLabel = document.getElementById("menu-legend-label");
  const menuAboutButton = document.getElementById("menu-about");
  const aboutDialog = document.getElementById("about-dialog");
  const aboutVersion = document.getElementById("about-version");
  const closeAboutDialogButton = document.getElementById("close-about-dialog");
  const legend = document.getElementById("legend");
  const legendItems = document.querySelectorAll(".legend-item");
  const selectAllBtn = document.getElementById("legend-select-all");
  const selectAllLabel = document.getElementById("legend-select-all-label");
  const shouldShowLegendInitially = window.innerHeight > 700;

  console.info(
    "Viewport height:",
    window.innerHeight,
    "Show legend initially:",
    shouldShowLegendInitially,
  );

  legend.hidden = !shouldShowLegendInitially;
  menuLegendToggle.setAttribute("aria-pressed", String(shouldShowLegendInitially));
  menuLegendLabel.textContent = shouldShowLegendInitially
    ? "Ocultar legenda"
    : "Exibir legenda";

  const formattedVersionDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(versao_data));
  const versionHash = versao_hash === "#" ? "" : ` — ${versao_hash}`;
  aboutVersion.textContent = `Versão ${versao_numero}${versionHash} — ${formattedVersionDate}.`;

  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menu.hidden = isOpen;
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  });

  document.addEventListener("click", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });

  menuLegendToggle.addEventListener("click", () => {
    const isVisible = !legend.hidden;
    legend.hidden = isVisible;
    menuLegendToggle.setAttribute("aria-pressed", String(!isVisible));
    menuLegendLabel.textContent = isVisible ? "Exibir legenda" : "Ocultar legenda";
    closeMenu();
    menuButton.focus();
  });

  menuAboutButton.addEventListener("click", () => {
    closeMenu();
    aboutDialog.showModal();
  });

  aboutDialog.addEventListener("close", () => {
    menuButton.focus();
  });

  closeAboutDialogButton.addEventListener("click", () => {
    aboutDialog.close();
  });

  function updateMapFilter() {
    const activeItems = Array.from(
      document.querySelectorAll(".legend-item:not(.inactive)"),
    );
    const checkedDays = activeItems.map((item) => item.getAttribute("data-day"));
    selectAllLabel.textContent =
      activeItems.length === legendItems.length
        ? "Desmarcar todos"
        : "Selecionar todos";

    if (checkedDays.length === 0) {
      map.setFilter("feira-livre-layer", ["==", "tx_dia_funcionamento", "NONE"]);
    } else {
      map.setFilter("feira-livre-layer", [
        "match",
        ["get", "tx_dia_funcionamento"],
        checkedDays,
        true,
        false,
      ]);
    }
  }

  legendItems.forEach((item) => {
    item.addEventListener("click", () => {
      const isPressed = item.getAttribute("aria-pressed") === "true";
      item.setAttribute("aria-pressed", String(!isPressed));
      item.classList.toggle("inactive", isPressed);
      updateMapFilter();
    });
  });

  selectAllBtn.addEventListener("click", () => {
    const allActive = Array.from(legendItems).every(
      (item) => !item.classList.contains("inactive"),
    );

    if (allActive) {
      legendItems.forEach((item) => {
        item.classList.add("inactive");
        item.setAttribute("aria-pressed", "false");
      });
    } else {
      legendItems.forEach((item) => {
        item.classList.remove("inactive");
        item.setAttribute("aria-pressed", "true");
      });
    }
    updateMapFilter();
  });

  updateMapFilter();

  function obter_horario_funcionamento(properties) {
    const categoria = properties.cd_tipo_categoria;
    if (typeof categoria !== "string" || categoria.trim() === "") return null;

    if (categoria === "T") {
      return "Tradicional - 8h às 14h ☀";
    } else if (categoria === "N") {
      return "Noturna - 16h às 21h 🦉";
    } else if (categoria === "O") {
      return "🌱 Orgânica - 8h às 14h";
    }
    return null;
  }

  map.on("click", "feira-livre-layer", async (e) => {
    const feature = obterFeatureSelecionada(e);
    if (!feature) {
      console.warn("Não foi possível obter os dados da feira selecionada.");
      showModal(
        "Dados indisponíveis",
        "Não foi possível carregar os dados desta feira.",
      );
      return;
    }

    const properties =
      feature.properties && typeof feature.properties === "object"
        ? feature.properties
        : {};
    const targetCoords = feature.geometry.coordinates.slice();
    routeRequestController?.abort();
    routeRequestController = null;

    const titulo = obterValorPropriedade(properties, "nm_equipamento", "Feira livre");

    const descricao = `
              <strong>Dia da semana:</strong> ${escaparHtml(obterValorPropriedade(properties, "tx_dia_funcionamento", "Não informado"))}<br>
              <strong>Horário:</strong> ${escaparHtml(obter_horario_funcionamento(properties) || "Não informado")}<br>
              <strong>Endereço:</strong> ${escaparHtml(obterValorPropriedade(properties, "tx_endereco_equipamento", "Sem endereço."))}<br>
              <strong>Quantidade de barracas:</strong> ${escaparHtml(obterValorPropriedade(properties, "qt_equipamento", "Não informada"))}<br><br>
              <strong>Trajeto a pé:</strong> <span id="distance-val">Calculando...</span><br><br>
              <a id="google-maps-link" target="_blank">Abrir rota no Google Maps ↗</a>
              <a id="share-link-feira" href="#" target="_blank" title="Compartilhar feira livre">
              <img src="images/share.png" alt="Compartilhar feira livre" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 35px;">
              </a>
          `;

    showModal(titulo, descricao);

    const distanceSpan = document.getElementById("distance-val");
    const gMapsLink = document.getElementById("google-maps-link");

    if (map.getSource("route-line")) {
      map.getSource("route-line").setData({ type: "FeatureCollection", features: [] });
    }

    console.log("User location:", userLocation);
    if (userLocation) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${targetCoords[1]},${targetCoords[0]}&travelmode=walking`;
      gMapsLink.href = googleMapsUrl;
      gMapsLink.style.display = "inline-block";

      const requestController = new AbortController();
      routeRequestController = requestController;

      try {
        const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${ORS_API_KEY}&start=${userLocation[0]},${userLocation[1]}&end=${targetCoords[0]},${targetCoords[1]}`;
        const response = await fetch(url, { signal: requestController.signal });
        if (!response.ok) throw new Error("Routing API failed");

        const data = await response.json();
        if (requestController.signal.aborted || !dialog.open) return;

        if (map.getSource("route-line")) {
          map.getSource("route-line").setData(data);
        } else {
          map.addSource("route-line", { type: "geojson", data: data });
          map.addLayer(
            {
              id: "walk-route-layer",
              type: "line",
              source: "route-line",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#1a73e8",
                "line-width": 5,
                "line-opacity": 0.85,
              },
            },
            "feira-livre-layer",
          );
        }

        const distanceMeters = data.features[0].properties.summary.distance;
        const durationSeconds = data.features[0].properties.summary.duration;

        const distText =
          distanceMeters > 1000
            ? (distanceMeters / 1000).toFixed(1) + " km"
            : Math.round(distanceMeters) + " m";
        const timeText = Math.round(durationSeconds / 60) + " min";

        distanceSpan.innerHTML = `${distText} (~${timeText})`;
        distanceSpan.style.color = "#333";
      } catch {
        if (requestController.signal.aborted) return;
        distanceSpan.textContent = "Erro ao calcular trajeto.";
        distanceSpan.style.color = "red";
      } finally {
        if (routeRequestController === requestController) {
          routeRequestController = null;
        }
      }
    } else {
      distanceSpan.textContent = localizacaoForaMunicipio
        ? "Sua localização está fora do município de São Paulo."
        : "Ative sua localização para calcular.";
      distanceSpan.style.color = "#555";
      gMapsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${targetCoords[1]},${targetCoords[0]}&travelmode=walking`;
      gMapsLink.style.display = "inline-block";
    }
  });

  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -40],
  });

  map.on("mouseenter", "feira-livre-layer", (e) => {
    const feature = obterFeatureSelecionada(e);
    if (!feature) return;

    map.getCanvas().style.cursor = "pointer";
    const coordinates = feature.geometry.coordinates.slice();
    const properties =
      feature.properties && typeof feature.properties === "object"
        ? feature.properties
        : {};
    const endereco = escaparHtml(
      obterValorPropriedade(properties, "tx_endereco_equipamento", "Sem endereço."),
    ).replaceAll(" ", "&nbsp;");
    const title = `<strong>${escaparHtml(obterValorPropriedade(properties, "tx_dia_funcionamento", "Dia não informado"))} - ${escaparHtml(obterValorPropriedade(properties, "nm_equipamento", "Feira livre"))}</strong><br>${endereco}<br>BARRACAS: ${escaparHtml(obterValorPropriedade(properties, "qt_equipamento", "Não informada"))}`;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    hoverPopup.setLngLat(coordinates).setHTML(title).addTo(map);
  });

  map.on("mouseleave", "feira-livre-layer", () => {
    map.getCanvas().style.cursor = "";
    hoverPopup.remove();
  });
}
