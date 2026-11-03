import * as maplibregl from "https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.mjs";

const ORS_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNkZTljYTNjYWE2NjQxYzM5MjBmY2M2N2EwZWIyZjRlIiwiaCI6Im11cm11cjY0In0=";
const MAPTILER_API_KEY = "auHi8tQJGZuSo0I0DjdX";

let userLocation = null;

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/01a0eaed-547f-7e52-a4b5-94650be7ecfd/style.json?key=${MAPTILER_API_KEY}`,
  center: [-46.6333, -23.5505],
  zoom: 11,
  attributionControl: false,
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

geolocateControl.on("error", async (e) => {
  console.error("User location error:", e);
  showModal(
    "Erro ao obter sua localização",
    "Não foi possível obter sua localização. Por favor, verifique as permissões do navegador.",
  );
});

map.on("load", async () => {
  console.log("Map loaded. Triggering geolocation...");
  console.log("Map style:", map.getStyle());
  console.log("Map layers:", map.getStyle().layers);

  geolocateControl.trigger();

  const icons = [
    {
      id: "icon-red",
      color: "#cb2b3e",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    },
    {
      id: "icon-blue",
      color: "#2a81cb",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    },
    {
      id: "icon-green",
      color: "#4CAF50",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    },
    {
      id: "icon-gold",
      color: "#FFD700",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    },
    {
      id: "icon-violet",
      color: "#9932CC",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    },
    {
      id: "icon-yellow",
      color: "#FFD700",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    },
    {
      id: "icon-grey",
      color: "#808080",
      url: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
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
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }

  function getTentSvgString(color = "#E63946", size = 32) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path fill="${color}" d="M90.9 270.9L67.7 508.9C65.8 527.7 80.6 544 99.5 544L272.2 544C298.7 544 320.2 522.5 320.2 496L320.2 367C320.2 358.7 326.9 352 335.2 352C340.7 352 345.8 355 348.4 359.9L434.5 518.9C442.9 534.4 459.1 544 476.7 544L540.8 544C559.7 544 574.5 527.7 572.6 508.9L549.6 271.1C547.7 251.5 536.8 233.8 520.1 223.3L344.9 112.3C329.2 102.3 309.1 102.4 293.4 112.4L120.1 223.2C103.6 233.8 92.8 251.4 90.9 270.9z"/>
</svg>`;
  }

  for (const icon of icons) {
    const svgStringWithColor = getTentSvgString(icon.color, 32);
    const img = await createSvgImage(svgStringWithColor, 20, 20);

    console.log(`Created SVG image for ${icon.id} with color ${icon.color}`);

    map.addImage(icon.id, img);
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

      // --- NEW: Text Label Settings ---
      //'text-field': ['get', 'tx_dia_funcionamento'], // Reads the day of the week
      "text-field": "{tx_dia_funcionamento} - {nm_equipamento}",
      "text-size": 12,
      "text-offset": [0, 0.5], // Moves the text slightly down from the bottom of the pin
      "text-anchor": "top", // Anchors the top of the text to the offset point
      "text-optional": true, // Allows MapLibre to hide the text if the map gets too crowded, keeping the pin visible
    },
    paint: {
      // --- NEW: Styling the text so it stands out ---
      "text-color": "#333333",
      "text-halo-color": "#ffffff", // White outline
      "text-halo-width": 2, // Thickness of the white outline
    },
  });

  console.log("Map layers", map.getStyle().layers[90], map);

  startGeolocation();
  setupInteractions();
});

function startGeolocation() {
  console.log("Setting up geolocation functionality...", geolocateControl);

  geolocateControl.on("geolocate", async (e) => {
    userLocation = [e.coords.longitude, e.coords.latitude];
    console.log("User location obtained:", userLocation);
  });
}

function showModal(titulo, descricao) {
  const dialog = document.getElementById("event-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDesc = document.getElementById("dialog-description");
  const closeBtn = document.getElementById("close-dialog");

  closeBtn.addEventListener("click", () => {
    console.log("Closing dialog and clearing route line...");
    dialog.close();
    if (map.getSource("route-line")) {
      map
        .getSource("route-line")
        .setData({ type: "FeatureCollection", features: [] });
    }
  });

  dialogTitle.textContent = titulo;
  dialogDesc.innerHTML = descricao;
  dialog.showModal();
}

function setupInteractions() {
  const toggleBtn = document.getElementById("toggle-button");
  const legend = document.getElementById("legend");
  const legendToggle = document.getElementById("legend-toggle");
  const legendItems = document.querySelectorAll(".legend-item");
  const selectAllBtn = document.getElementById("legend-select-all");

  function updateMapFilter() {
    const activeItems = Array.from(
      document.querySelectorAll(".legend-item:not(.inactive)"),
    );
    const checkedDays = activeItems.map((item) =>
      item.getAttribute("data-day"),
    );

    if (checkedDays.length === 0) {
      map.setFilter("feira-livre-layer", [
        "==",
        "tx_dia_funcionamento",
        "NONE",
      ]);
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

  const daysOfWeek = [
    "DOMINGO",
    "SEGUNDA-FEIRA",
    "TERCA-FEIRA",
    "QUARTA-FEIRA",
    "QUINTA-FEIRA",
    "SEXTA-FEIRA",
    "SABADO",
  ];
  const todayString = daysOfWeek[new Date().getDay()];

  legendItems.forEach((item) => {
    // if (item.getAttribute('data-day') !== todayString) {
    //     item.classList.add('inactive');
    // }

    item.addEventListener("click", () => {
      item.classList.toggle("inactive");
      updateMapFilter();
    });
  });

  selectAllBtn.addEventListener("click", () => {
    const allActive = Array.from(legendItems).every(
      (item) => !item.classList.contains("inactive"),
    );

    if (allActive) {
      legendItems.forEach((item) => item.classList.add("inactive"));
    } else {
      legendItems.forEach((item) => item.classList.remove("inactive"));
    }
    updateMapFilter();
  });

  updateMapFilter();

  legendToggle.addEventListener("click", () => {
    const isHidden = legend.classList.toggle("collapsed");
    legendToggle.textContent = isHidden ? "+" : "X";
    legendToggle.setAttribute(
      "aria-label",
      isHidden ? "Mostrar legenda" : "Ocultar legenda",
    );
  });

  toggleBtn.addEventListener("click", () => {
    const visibility = map.getLayoutProperty("feira-livre-layer", "visibility");
    if (visibility === "visible") {
      map.setLayoutProperty("feira-livre-layer", "visibility", "none");
      toggleBtn.textContent = "Turn Fair Layer On";
      toggleBtn.style.backgroundColor = "#555";
      legend.style.display = "none";
    } else {
      map.setLayoutProperty("feira-livre-layer", "visibility", "visible");
      toggleBtn.textContent = "Turn Fair Layer Off";
      toggleBtn.style.backgroundColor = "#1a73e8";
      legend.style.display = "block";
    }
  });

  function obter_horario_funcionamento(properties) {
    const categoria = properties.cd_tipo_categoria;
    if (!categoria || categoria.trim() === "") return null;

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
    const properties = e.features[0].properties;
    const targetCoords = e.features[0].geometry.coordinates.slice();

    const titulo = properties.nm_equipamento || "Street Fair";

    const descricao = `
              <strong>Dia da semana:</strong> ${properties.tx_dia_funcionamento || "N/A"}<br>
              <strong>Horário:</strong> ${obter_horario_funcionamento(properties) || "N/A"}<br>
              <strong>Endereço:</strong> ${properties.tx_endereco_equipamento || "Sem endereço."}<br>
              <strong>Quantidade de barracas:</strong> ${properties.qt_equipamento || "Sem quantidade."}<br><br>
              <strong>Trajeto a pé:</strong> <span id="distance-val">Calculando...</span><br><br>
              <a id="google-maps-link" target="_blank">Abrir rota no Google Maps ↗</a>
              <a id="share-link-feira" href="#" target="_blank" title="Compartilhar feira livre">
              <img src="share.png" alt="Compartilhar feira livre" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 35px;">
              </a>
          `;

    showModal(titulo, descricao);

    const distanceSpan = document.getElementById("distance-val");
    const gMapsLink = document.getElementById("google-maps-link");

    if (map.getSource("route-line")) {
      map
        .getSource("route-line")
        .setData({ type: "FeatureCollection", features: [] });
    }

    console.log("User location:", userLocation);
    if (userLocation) {
      //const googleMapsUrl = `http://googleusercontent.com/maps.google.com/${userLocation[1]},${userLocation[0]}&destination=${targetCoords[1]},${targetCoords[0]}&travelmode=walking`;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${targetCoords[1]},${targetCoords[0]}&travelmode=walking`;
      gMapsLink.href = googleMapsUrl;
      gMapsLink.style.display = "inline-block";

      try {
        const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${ORS_API_KEY}&start=${userLocation[0]},${userLocation[1]}&end=${targetCoords[0]},${targetCoords[1]}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Routing API failed");

        const data = await response.json();

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
      } catch (error) {
        distanceSpan.textContent = "Erro ao calcular trajeto.";
        distanceSpan.style.color = "red";
      }
    } else {
      distanceSpan.textContent = "Ative sua localização para calcular.";
      distanceSpan.style.color = "#555";
      gMapsLink.href = `http://googleusercontent.com/maps.google.com/9{targetCoords[1]},${targetCoords[0]}`;
      gMapsLink.style.display = "inline-block";
    }
  });

  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -40],
  });

  map.on("mouseenter", "feira-livre-layer", (e) => {
    map.getCanvas().style.cursor = "pointer";
    const coordinates = e.features[0].geometry.coordinates.slice();
    const p = e.features[0].properties;
    const hoverTitle =
      p.tx_dia_funcionamento +
      " - " +
      p.nm_equipamento +
      "<br>" +
      p.tx_endereco_equipamento.replaceAll(" ", "&nbsp;") +
      "<br> BARRACAS: " +
      p.qt_equipamento;
    const title = hoverTitle || "Street Fair";
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    hoverPopup
      .setLngLat(coordinates)
      .setHTML(`<strong>${title}</strong>`)
      .addTo(map);
  });

  map.on("mouseleave", "feira-livre-layer", () => {
    map.getCanvas().style.cursor = "";
    hoverPopup.remove();
  });
}
