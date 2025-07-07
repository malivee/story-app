import Api from "../../data/api";
import SettingPresenter from "./setting-presenter";

export default class SettingPage {
  #presenter;

  async render() {
    return `
      <div class="container">
        <div class="profile-box">
          <button class="logout-btn">Logout</button>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new SettingPresenter({
      model: new Api(),
    });

    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", async () => {
      try {
        await this.#presenter.logout();
        this.redirectToHome();
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout gagal.");
      }
    });
  }

  redirectToHome() {
    window.location.hash = "#/";
    window.location.reload();
  }
}
