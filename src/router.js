import scorePage from "./pages/score";
import gamePage from "./pages/game";

const routes = {
  "/": gamePage,
  "/game": gamePage,
  "/score": scorePage,
};

function initialRoutes(el) {
  renderHTML(el, routes["/"]);
  window.onpopstate = () => renderHTML(el, routes[window.location.pathname]);
}

function routerPush(pathName, el) {
  window.history.pushState({}, pathName, window.location.origin + pathName);
  renderHTML(el, routes[pathName]);
}

function renderHTML(el, route) {
  if(!route) return;

  el.innerHTML = route();
}

export { initialRoutes, routerPush };
