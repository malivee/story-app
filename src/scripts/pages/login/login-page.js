import Api from "../../data/api.js";
import { saveApiHeaders } from "../../data/apiHeaders.js";
import routes from "../../routes/routes.js";
import LoginPresenter from "./login-presenter.js";
import logo from "../../../public/images/logoo.png";

export default class LoginPage {
  #presenter;
  async render() {
    return `
        <div class="login-container">
    <div class="login-box">
      <img src="${logo}" alt="dicoding storypost" class="logo" id="logo"/>
      <p class="description">
        <strong>Silahkan masukan email dan password kamu</strong><br />
        Masuk ke akun kamu
      </p>

      <form class="login-form">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Masukkan email kamu" required />

        <label for="password">Kata sandi</label>
        <input type="password" id="password" placeholder="Masukkan kata sandi" required />

        <p><a href="#/register">Belum mempunyai akun? Daftar sekarang</a></p>

        <button type="submit" id=login-button" class="login-button">Masuk</button>
      </form>
    </div>
  </div>
        `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      model: new Api(),
      view: this,
    });
    this.#presenter.init();

    const form = document.querySelector(".login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const result = await this.#presenter.login(
          email.value.toString(),
          password.value.toString()
        );

        saveApiHeaders(result.loginResult.token);
        window.location.hash = "/";
      } catch (error) {
        alert("Login gagal. Cek kembali email dan password kamu.");
      }
    });
  }
}
