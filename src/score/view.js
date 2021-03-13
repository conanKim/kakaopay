import { getQueryVariable } from "../util";
import { routerPush } from "../router";

const styles = `
.header {
  padding-top: 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
#body {
  margin-top: 200px;
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
          <div id="body">
            <span id="time"></span>
            <button id="button">다시 하기</button>
          </div>
        </div>
      `;
  }

  connectedCallback() {
    const time = getQueryVariable("time");
    const timeEl = this.shadowRoot.getElementById("time");
    const button = this.shadowRoot.getElementById("button");

    if (!parseFloat(time)) {
      timeEl.innerHTML = `성공 한 문제가 없습니다.`;
    } else {
      timeEl.innerHTML = `평균 성공 시간은 ${time / 1000}초 입니다.`;
    }
    button.onclick = (e) => {
      routerPush("/game");
    };
  }
}
customElements.define("score-view", ScoreView);
export default ScoreView;
