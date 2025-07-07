export default class RegisterPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  init() {
    console.log("RegisterPresenter initialized.");
  }

  async register(name, email, password) {
    try {
      const result = await this.#model.postRegister(name, email, password);
      return result;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  }
}
