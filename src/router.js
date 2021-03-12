import scorePage from "./score/view";
import gamePage from "./game/view";

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

function renderHTML(parent, route) {
  if (!route) return;
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  parent.appendChild(new route());
}

export { initialRoutes, routerPush };
