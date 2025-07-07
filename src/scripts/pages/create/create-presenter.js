export default class CreatePresenter {
  #model;

  constructor({ model }) {
    this.#model = model;
  }

  async startCamera() {
    return navigator.mediaDevices.getUserMedia({ video: true });
  }

  stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation tidak didukung."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  }

  async postStory({ description, imageBlob, lat, lon }) {
    return this.#model.postNewStory(description, imageBlob, lat, lon);
  }
}
