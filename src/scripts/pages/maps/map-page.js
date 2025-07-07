import MapPresenter from "./map-presenter.js";
import Api from "../../data/api.js";

export default class MapPage {
  #presenter;

  async render() {
    return `
      <h1 class="map-title">Peta Lokasi Story</h1>
      <div id="map" style="height: 500px;"></div>
    `;
  }

  async afterRender() {
    this.#presenter = new MapPresenter({
      model: new Api(),
      view: this,
    });

    await this.#presenter.init();
  }

  getMapElement() {
    return document.getElementById("map");
  }
}
