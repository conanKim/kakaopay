import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Game } from "../../src/constant";
import axios from "axios";
import * as util from "../../src/util";

describe("score.js", () => {
  describe("Game Test", () => {
    let jsdom;
    let ScoreView;
    let view;

    let button;
    let scoreEl;
    let timeEl;

    let stubQuery;

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
      stubQuery = sinon.stub(util, "getQueryVariable").callsFake((args) => {
        if (args === "time") return 1234.567;
        if (args === "score") return 4321;
        return null;
      });

      ScoreView = require("../../src/score/view");
      view = new ScoreView.default();
      view.getData = () => {
        view.data = data;
        return Promise.resolve(data);
      };

      view.connectedCallback();

      button = view.shadowRoot.getElementById("button");
      scoreEl = view.shadowRoot.getElementById("score");
      timeEl = view.shadowRoot.getElementById("time");
    });

    afterEach(() => {
      stubQuery.restore();
    });

    it("점수 화면이 나타나면 query 로 전달받은 점수와 시간이 나타난다.", () => {
      expect(scoreEl.innerHTML).to.equals("당신의 점수는 4321점 입니다.");
      expect(timeEl.innerHTML).to.equals(
        `평균 성공 시간은 ${(1.234567).toFixed(4)}초 입니다.`
      );
    });

    it("점수를 전달받지 못 한 경우 성공한 문제가 없다는 메세지가 나타난다.", () => {
      stubQuery.callsFake((args) => {
        return null;
      });

      view.connectedCallback();

      expect(scoreEl.innerHTML).to.equals("");
      expect(timeEl.innerHTML).to.equals(`성공한 문제가 없습니다.`);
    });

    it('버튼을 클릭하면 게임화면으로 전환', () => {
      var router = require("../../src/router");
      var stubRouterPush = sinon.stub(router, "routerPush");
      button.click();
      expect(stubRouterPush.calledWith("/game")).to.equals(true);

      stubRouterPush.restore();
    });
  });
});
