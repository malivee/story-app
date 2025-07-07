export default class LoginPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  init() {
    console.log("LoginPresenter initialized.");
  }

  async login(email, password) {
    try {
      const result = await this.#model.postLogin(email, password);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
}
