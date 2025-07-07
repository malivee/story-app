export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async init() {
    const dataList = this.#model.getData();
    this.#view.renderCards(dataList);
  }
}
