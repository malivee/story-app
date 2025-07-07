export default class SettingPresenter {
  #model;

  constructor({ model }) {
    this.#model = model;
  }

  async logout() {
    await this.#model.deleteData();
  }
}