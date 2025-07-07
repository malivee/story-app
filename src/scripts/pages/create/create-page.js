import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import CreatePresenter from "./create-presenter.js";
import Api from "../../data/api.js";
import { showLocalNotification } from "../../utils/index.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class CreatePage {
  #presenter;
  #stream;
  #mapInstance;
  #currentMarker;

  async render() {
    return `
      <div class="image-row">
        <div class="image-box">
          <video id="camera-video" class="camera__video" autoplay></video>
          <canvas id="camera-canvas" style="display: none;"></canvas>
        </div>
        <div class="image-box">
          <img id="preview-image" src="your-image.png" alt="Preview" />
        </div>
      </div>

      <div class="button-group">
        <button class="btn dark" id="take-picture-btn">Ambil Gambar</button>
        <button class="btn dark" id="retake-picture-btn" style="display: none;">Ulangi Ambil</button>
        <button class="btn teal" id="map-button"><i class="icon">📍</i> Post your position</button>
      </div>

      <div id="map" class="map" style="display: none; height: 300px;"></div>

      <h1 class="location-text">Your Location:</h1>

      <label for="story-description" class="location-label">Deskripsi Story:</label>
      <textarea id="story-description" placeholder="Buat Story Anda" class="story-input"></textarea>

      <button class="btn dark large">Posting</button>
    `;
  }

  async afterRender() {
    const self = this;
    this.#presenter = new CreatePresenter({ model: new Api() });

    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("camera-canvas");
    const preview = document.getElementById("preview-image");
    const takeBtn = document.getElementById("take-picture-btn");
    const retakeBtn = document.getElementById("retake-picture-btn");
    const mapBtn = document.getElementById("map-button");
    const postBtn = document.querySelector(".btn.dark.large");
    const locationText = document.querySelector(".location-text");
    const mapContainer = document.getElementById("map");

    this.#stream = await this.#presenter.startCamera();
    video.srcObject = this.#stream;
    video.play();

    takeBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      preview.src = imageData;

      this.#presenter.stopCamera(this.#stream);
      this.#stream = null;

      retakeBtn.style.display = "inline-block";
      takeBtn.style.display = "none";
    });

    retakeBtn.addEventListener("click", async () => {
      preview.src = "your-image.png";
      retakeBtn.style.display = "none";
      takeBtn.style.display = "inline-block";

      this.#stream = await this.#presenter.startCamera();
      video.srcObject = this.#stream;
      video.play();
    });

    mapBtn.addEventListener("click", async () => {
      mapContainer.style.display = "block";

      try {
        const coords = await this.#presenter.getCurrentLocation();
        locationText.innerText = `Your location: ${coords.latitude}, ${coords.longitude}`;

        if (this.#mapInstance) {
          this.#mapInstance.remove();
        }

        this.#mapInstance = L.map("map").setView(
          [coords.latitude, coords.longitude],
          15
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        }).addTo(this.#mapInstance);

        this.#currentMarker = L.marker([coords.latitude, coords.longitude])
          .addTo(this.#mapInstance)
          .bindPopup("Lokasi Anda")
          .openPopup();

        this.#mapInstance.on("click", (e) => {
          const { lat, lng } = e.latlng;
          if (this.#currentMarker) {
            this.#mapInstance.removeLayer(this.#currentMarker);
          }
          this.#currentMarker = L.marker([lat, lng])
            .addTo(this.#mapInstance)
            .bindPopup(`Marker baru di: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            .openPopup();

          locationText.innerText = `Your location: ${lat}, ${lng}`;
        });
      } catch (error) {
        alert("Gagal mendapatkan lokasi: " + error.message);
      }
    });

    postBtn.addEventListener("click", async () => {
      const description = document.querySelector(".story-input").value;
      const imageSrc = preview.src;
      const locationTextValue = locationText.innerText;

      if (
        !description ||
        imageSrc.includes("default.png") ||
        imageSrc.includes("your-image.png")
      ) {
        alert("Lengkapi deskripsi dan ambil gambar terlebih dahulu.");
        return;
      }

      const locationMatch = locationTextValue.match(
        /(-?\d+\.\d+),\s*(-?\d+\.\d+)/
      );
      const lat = locationMatch ? parseFloat(locationMatch[1]) : null;
      const lon = locationMatch ? parseFloat(locationMatch[2]) : null;

      try {
        const blob = await fetch(imageSrc).then((res) => res.blob());
        await this.#presenter.postStory({
          description,
          imageBlob: blob,
          lat,
          lon,
        });

        showLocalNotification("Story berhasil diposting", {
          body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
          icon: "/images/logo192.png",
          badge: "/images/logo192.png",
          data: { url: "/" },
        });

        self.resetForm();
        self.redirectToHome();
      } catch (error) {
        console.error("Posting gagal:", error);
        alert("Gagal posting: " + error.message);
      }
    });

    window.addEventListener("hashchange", () => {
      this.#presenter.stopCamera(this.#stream);
      this.destroy();
    });
  }

  resetForm() {
    document.getElementById("preview-image").src = "your-image.png";
    document.querySelector(".story-input").value = "";
    document.querySelector(".location-text").innerText = "Your Location:";
    const mapContainer = document.getElementById("map");
    mapContainer.style.display = "none";
    if (this.#mapInstance) {
      this.#mapInstance.remove();
      this.#mapInstance = null;
    }
  }

  redirectToHome() {
    window.location.hash = "#/";
    window.location.reload();
  }

  destroy() {
    if (this.#mapInstance) {
      this.#mapInstance.remove();
    }
    if (this.#stream) {
      this.#presenter.stopCamera(this.#stream);
    }
  }
}
