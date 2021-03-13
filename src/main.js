import "./style.css";

const { initialRoutes, routerPush } = require("./router");

const app = document.querySelector("#app");

initialRoutes(app);

window.onload = () => {
  const linker = document.querySelectorAll("div.link-box");

  linker.forEach((el) => {
    el.addEventListener("click", (evt) => {
      const pathName = evt.target.getAttribute("route");
      routerPush(pathName);
    });
  });
};
