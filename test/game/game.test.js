import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Game } from "../../src/constant";

describe("view.js", () => {
  describe("Game Test", () => {
    let jsdom;
    let GameView;
    let view;
    let stubSetInterval;

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

    beforeEach(() => {
      GameView = require("../../src/game/view");
      view = new GameView.default();
      view.connectedCallback();

      stubSetInterval = sinon.stub(global, "setInterval");
      stubSetInterval.onCall(0).callsFake((arg1, arg2) => {
        arg1();
      });
    });

    afterEach(() => {
      stubSetInterval.restore();
    });

    it("초기 점수는 10점이다.", () => {
      expect(view.score).to.equals(10);
    });

    it("게임 중 오답을 입력했을 경우 점수가 감소된다.", () => {
      view.state = Game.State.GAME;
      view.score = 5;
      view.value = "ANSWER";
      view.shadowRoot.getElementById("input").value = "ABCD";
      view.shadowRoot.getElementById("button").click();

      expect(view.score).to.equals(4);
      expect(view.shadowRoot.getElementById("score").innerHTML).to.equals("4");
    });

    it("게임이 시작하면 1초마다 시간이 1씩 감소한다", () => {
      view.state = Game.State.READY;
      view.shadowRoot.getElementById("button").click();

      expect(view.leftTime).to.equals(9);
      expect(view.shadowRoot.getElementById("timer").innerHTML).to.equals("9");
    });
  });
});
