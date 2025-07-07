import Api from "../../data/api.js";
import RegisterPresenter from "./register-presenter.js";
import logo from "../../../public/images/logoo.png";

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <div class="login-container">
        <div class="login-box">
          <img src="${logo}" alt="dicoding storypost" class="logo" id="logo"/>
          <p class="description">
            <strong>Silakan masukkan data untuk mendaftar</strong><br />
            Daftarkan akun kamu
          </p>

          <form class="register-form">
            <label for="name">Nama</label>
            <input type="text" id="name" placeholder="Masukkan nama kamu" required />

            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Masukkan email kamu" required />

            <label for="password">Kata Sandi</label>
            <input type="password" id="password" placeholder="Masukkan kata sandi" required />

            <p><a href="#/login">Sudah punya akun? Masuk di sini</a></p>

            <button type="submit" class="login-button">Daftar</button>
          </form>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      model: new Api(),
      view: this,
    });
    this.#presenter.init();

    const form = document.querySelector(".register-form");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        await this.#presenter.register(
          name.value.toString(),
          email.value.toString(),
          password.value.toString()
        );

        window.location.hash = "/login";
      } catch (error) {
        alert("Registrasi gagal. Cek kembali data kamu.");
      }
    });
  }
}
