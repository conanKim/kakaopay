import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";

describe("view.js", () => {
  describe("Game Test", () => {
    let jsdom;
    before(async () => {
      jsdom = new JSDOM("<!doctype html><html><body></body></html>");
      await new Promise((resolve) => {
        jsdom.window.addEventListener("load", resolve);
      });
      global.window = jsdom.window;
      global.document = window.document;
      global.HTMLElement = window.HTMLElement;
      global.customElements = window.customElements;
    });

    it("초기 점수는 10점이다.", () => {
      const GameView = require("../../src/game/view");
      const view = new GameView.default();
      expect(view.score).to.equals(10);
    });

    it("오답을 입력했을 경우 점수가 감소된다.", () => {
      const GameView = require("../../src/game/view");
      const view = new GameView.default();
      view.connectedCallback();

      view.score = 5;
      view.value = "ANSWER";
      view.shadowRoot.getElementById('input').value = "ABCD";
      view.shadowRoot.getElementById('button').click();

      expect(view.score).to.equals(4);
    });
  });
});
