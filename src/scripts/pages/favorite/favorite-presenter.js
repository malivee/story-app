export default class FavoritePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async init() {
    try {
      const dataList = await this.#model.getData();
      if (!dataList || dataList.length === 0) {
        this.#view.renderEmpty();
      } else {
        await this.#view.renderCards(dataList);
      }
    } catch (error) {
      this.#view.renderError(error.message);
    }
  }
}
