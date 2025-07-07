import HomePage from "../pages/home/home-page.js";
import LoginPage from "../pages/login/login-page.js";
import RegisterPage from "../pages/register/register-page.js";
import CreatePage from "../pages/create/create-page.js";
import SettingPage from "../pages/setting/setting-page.js";
import MapPage from "../pages/maps/map-page.js";
import FavoritePage from "../pages/favorite/favorite-page.js";


const routes = {
  "/": new HomePage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/create": new CreatePage(),
  "/map": new MapPage(),
  "/setting": new SettingPage(),
  "/favorite": new FavoritePage()
};

export default routes;
