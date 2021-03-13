import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Game } from "../../src/constant";

describe("view.js", () => {
  describe("Game Test", () => {
    let jsdom;
    let GameView;
    let view;

    let input;
    let button;
    let scoreEl;
    let timerEl;

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

      input = view.shadowRoot.getElementById("input");
      button = view.shadowRoot.getElementById("button");
      scoreEl = view.shadowRoot.getElementById("score");
      timerEl = view.shadowRoot.getElementById("timer");
    });

    afterEach(() => {
      stubSetInterval.restore();
    });

    it("초기 점수는 10점이다.", () => {
      expect(view.score).to.equals(10);
    });

    it('시작 버튼을 누른 경우 게임이 시작된다.', () => {
      view.state = Game.State.READY;
      button.click();
      expect(view.state).to.equals(Game.State.GAME);
    });

    it('초기화 버튼을 누른 경우 게임이 초기화 된다.', () => {
      view.state = Game.State.GAME;
      button.click();
      expect(view.state).to.equals(Game.State.READY);
      expect(view.score).to.equals(10);
      expect(view.leftTime).to.equals(10);
    });

    it("게임 중 오답을 입력하고 Enter 키를 누른 경우 input 이 초기화 된다.", () => {
      view.state = Game.State.GAME;
      view.value = "ANSWER";
      input.value = "ABCD";
      var event = document.createEvent("Events");
      event.initEvent('keydown', true, true);
      event.key = 'Enter';
      input.dispatchEvent(event);

      expect(input.value).to.equals("");
    });

    it("게임 중 남은시간이 0초가 된 경우 점수가 감소된다.", () => {
      view.state = Game.State.READY;
      view.score = 5;
      view.leftTime = 1;
      button.click();

      expect(view.score).to.equals(4);
    });

    it("게임이 시작하면 1초마다 시간이 1씩 감소한다", () => {
      view.state = Game.State.READY;
      button.click();

      expect(view.leftTime).to.equals(9);
      expect(timerEl.innerHTML).to.equals("9");
    });
  });
});
