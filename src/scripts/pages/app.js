import { getApiHeaders } from "../data/apiHeaders.js";
import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from "../utils/notification-helper.js";
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from "../utils/templates.js";


class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  async #setupPushNotification() {
    const tools = document.getElementById("push-notification-tools");
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      tools.innerHTML = generateUnsubscribeButtonTemplate();
      document
        .getElementById("unsubscribe-button")
        .addEventListener("click", () => {
          unsubscribe().finally(() => this.#setupPushNotification());
        });
    } else {
      tools.innerHTML = generateSubscribeButtonTemplate();
      document
        .getElementById("subscribe-button")
        .addEventListener("click", () => {
          subscribe().finally(() => this.#setupPushNotification());
        });
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const isAuthPage = url === "/login" || url === "/register";
    const token = getApiHeaders();

    if (!token && !isAuthPage) {
      window.location.hash = "/login";
      return;
    }

    if (!page) {
      this.#content.innerHTML = "<h1>404 - Page not found</h1>";
      return;
    }

    if (isAuthPage) {
      const container = document.getElementById("container");
      container.innerHTML = await page.render();
      if (typeof page.afterRender === "function") {
        await page.afterRender();
      }
      return;
    }

    this.#content.innerHTML = await page.render();
    if (typeof page.afterRender === "function") {
      await page.afterRender();
    }

    

    await this.#setupPushNotification();
  }

}

export default App;
