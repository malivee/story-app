import "../styles/styles.css";
import logo from "../public/images/logoo.png";
import App from "./pages/app.js";
import { registerServiceWorker } from "./utils/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  const logoApp = document.getElementById("logo");
  logoApp.src = logo;

    await registerServiceWorker();

  const app = new App({
    drawerButton: document.getElementById("drawerButton"),
    navigationDrawer: document.getElementById("navigationDrawer"),
    content: document.getElementById("main-content"),
  });

  await app.renderPage();

  

  window.addEventListener("hashchange", async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage();
      });
    } else {
      await app.renderPage();
    }
  });
});
