import { getQueryVariable } from "../util";
import { routerPush } from "../router";

const styles = `
#header {
  text-align: center;
  margin-top: 150px;
  font-size: 50px;
}
#body {
  margin-top: 50px;
  font-size: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  margin: 10px;
  width: 100px;
  height: 30px;
}
`;

class ScoreView extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="score" id="root">
          <div id="header">
            <span>Mission Complete!!!</span>
          </div>
          <div id="body">
            <span id="score"></span>
            <span id="time"></span>
            <button id="button">다시 하기</button>
          </div>
        </div>
      `;
  }

  connectedCallback() {
    const time = getQueryVariable("time");
    const score = getQueryVariable("score");
    const timeEl = this.shadowRoot.getElementById("time");
    const scoreEl = this.shadowRoot.getElementById("score");
    const button = this.shadowRoot.getElementById("button");

    const fixedTime = (time / 1000).toFixed(4);

    if (!parseFloat(time)) {
      scoreEl.innerHTML = "";
      timeEl.innerHTML = `성공한 문제가 없습니다.`;
    } else {
      scoreEl.innerHTML = `당신의 점수는 ${score}점 입니다.`;
      timeEl.innerHTML = `평균 성공 시간은 ${fixedTime}초 입니다.`;
    }
    button.onclick = (e) => {
      routerPush("/game");
    };
  }
}
customElements.define("score-view", ScoreView);
export default ScoreView;
