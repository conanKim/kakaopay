import { expect } from "chai";
import sinon from "sinon";
const { JSDOM } = require("jsdom");

describe("main.js", () => {
  describe("Main Test", () => {
    let jsdom;

    before(async () => {
      jsdom = await JSDOM.fromFile("index.html", {
        resources: "usable",
        runScripts: "dangerously",
      });
      await new Promise((resolve) =>
        jsdom.window.addEventListener("load", resolve)
      );
      global.window = jsdom.window;
      global.document = jsdom.window.document;
    });

    it('main.js 가 호출 되면 app element 에 대해 router 를 초기화한다.', () => {
      const router = require("../src/router")
      const stub = sinon.stub(router, 'initialRoutes');
      const stubQuerySelector = sinon
        .stub(document, "querySelector")
        .returns("APP_ELEMENT");

      require("../src/main");

      expect(stubQuerySelector.calledWith("#app")).to.equals(true);
      expect(stub.calledWith("APP_ELEMENT")).to.equals(true);
    });
  });
});
