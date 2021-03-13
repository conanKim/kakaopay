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
      view.getData = () => {
        const data = [
          { text: "ANY_DATA1", time: 123 },
          { text: "ANY_DATA2", time: 321 },
        ];
        view.data = data;
        return Promise.resolve(data);
      };

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

    it("초기 점수는 문제의 갯수이다.", (done) => {
      new Promise((resolve) => {
        view.init();
        resolve();
      }).then(() => {
        expect(view.score).to.equals(2);
        done();
      });
    });

    it("시작 버튼을 누른 경우 게임이 시작된다.", () => {
      view.state = Game.State.READY;
      button.click();
      expect(view.state).to.equals(Game.State.GAME);
    });

    it("게임이 시작되면 현재 스테이지의 문제 문구가 나타난다.", () => {
      view.start();
      expect(view.textEl.innerText).to.equals("ANY_DATA1");
    });

    it("초기화 버튼을 누른 경우 게임이 초기화 된다.", (done) => {
      new Promise((resolve) => {
        view.state = Game.State.GAME;
        button.click();
        resolve();
      }).then(() => {
        expect(view.state).to.equals(Game.State.READY);
        expect(view.score).to.equals(2);
        expect(view.leftTime).to.equals(123);

        done();
      });
    });

    it("게임 중 정답을 입력하고 Enter 키를 누른 경우 다음 스테이지로 넘어간다.", () => {
      view.state = Game.State.GAME;
      view.stage = 0;
      input.value = "ANY_DATA1";

      var event = document.createEvent("Events");
      event.initEvent("keydown", true, true);
      event.key = "Enter";
      input.dispatchEvent(event);

      expect(input.value).to.equals("");
      expect(view.stage).to.equals(1);
    });

    it("게임 중 오답을 입력하고 Enter 키를 누른 경우 input 이 초기화 된다.", () => {
      view.state = Game.State.GAME;
      view.stage = 0;
      input.value = "ABCD";

      var event = document.createEvent("Events");
      event.initEvent("keydown", true, true);
      event.key = "Enter";
      input.dispatchEvent(event);

      expect(input.value).to.equals("");
      expect(view.stage).to.equals(0);
    });

    it("게임 중 남은시간이 0초가 된 경우 점수가 감소된다.", () => {
      view.state = Game.State.READY;
      view.score = 5;
      view.leftTime = 1;
      button.click();

      expect(view.score).to.equals(4);
    });

    it("게임이 시작하면 1초마다 시간이 1씩 감소한다", (done) => {
      new Promise((resolve) => {
        view.state = Game.State.READY;
        view.stage = 0;
        view.data = [{ time: 10 }];
        view.init();
        resolve();
      }).then(() => {
        button.click();
        expect(view.leftTime).to.equals(122);
        expect(timerEl.innerHTML).to.equals("122");

        done();
      });
    });

    it("마지막 스테이지가 종료되면 결과화면으로 라우팅된다.", () => {
      var router = require("../../src/router");
      var stubRouterPush = sinon.stub(router, "routerPush");
      var clock = sinon.useFakeTimers(2000);

      view.stage = 1;
      view.totalTime = 1000;
      view.score = 2;
      view.leftTime = 10;
      view.stageTime = 1000;
      input.value = "ANY_DATA2";

      var event = document.createEvent("Events");
      event.initEvent("keydown", true, true);
      event.key = "Enter";
      input.dispatchEvent(event);

      expect(stubRouterPush.calledWith("/score", "?time=1000")).to.equals(true);

      stubRouterPush.restore();
      clock.restore();
    });
  });
});
