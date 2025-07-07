// src/scripts/pages/map/map-presenter.js
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class MapPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async init() {
    const mapElement = this.#view.getMapElement();
    const map = L.map(mapElement).setView([0, 0], 2); 

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    try {
      const result = await this.#model.getData();

      if (!result || !Array.isArray(result.listStory)) {
        throw new Error("Data cerita tidak valid.");
      }

      const stories = result.listStory;

      stories.forEach((story) => {
        const { lat, lon, description, name } = story;

        if (lat && lon) {
          const marker = L.marker([lat, lon]).addTo(map);
          marker.bindPopup(`<b>${name}</b><br>${description}`);
        }
      });

      const first = stories.find((s) => s.lat && s.lon);
      if (first) {
        map.setView([first.lat, first.lon], 10);
      }
    } catch (error) {
      console.error("Gagal memuat data peta:", error);
      alert("Gagal memuat lokasi cerita.");
    }
  }
}
