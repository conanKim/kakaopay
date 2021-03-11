import { expect } from "chai";
const { JSDOM } = require("jsdom");

describe("main.js", () => {
  describe("Main Test", () => {
    let jsdom;
    let component;

    before(async () => {
      jsdom = await JSDOM.fromFile("index.html", {
        resources: "usable",
        runScripts: "dangerously",
      });
      await new Promise((resolve) =>
        jsdom.window.addEventListener("load", resolve)
      );
      global.document = jsdom.window.document;
      component = require("../src/main").component;
    });

    it("HELLO WORLD 가 렌더링 되어야 한다.", () => {
      component();

      const innerHTML = document.getElementById("main").innerHTML;
      expect(innerHTML).to.equal("HELLO WORLD")
    });
  });
});
