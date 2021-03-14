import { Game } from "../constant";
import { routerPush } from "../router";
import axios from "axios";

const styles = `
.header {
  padding-top: 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
#body {
  margin-top: 200px;
  font-size: 50px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
input {
  width: 300px;
  height: 40px;
  font-size: 25px;
}
button {
  margin: 10px;
  width: 100px;
  height: 30px;
}
`;

class GameView extends HTMLElement {
  leftTime;
  timerId;
  score;
  stage = 0;
  stageTime;
  totalTime = 0;
  data;

  input;
  button;
  scoreEl;
  timerEl;
  textEl;

  state = Game.State.READY;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="game" id="root">
          <div class="header" id="header">
            <span id="timer"></span>
            <span id="score"></span>
          </div>
          <div id="body">
            <span class='text' id="text">Loading...</span>
            <input id='input' hidden="true" />
            <button id="button" hidden="true">${
              Game.ButtonLabel[this.state]
            }</button>
          </div>
        </div>
      `;
  }

  connectedCallback() {
    this.button = this.shadowRoot.getElementById("button");
    this.input = this.shadowRoot.getElementById("input");
    this.scoreEl = this.shadowRoot.getElementById("score");
    this.timerEl = this.shadowRoot.getElementById("timer");
    this.textEl = this.shadowRoot.getElementById("text");

    const handleClick = () => {
      switch (this.state) {
        case Game.State.READY:
          this.start();
          break;
        case Game.State.GAME:
          this.init();
          break;
      }

      this.updateRender();
    };

    const handleKeydown = (e) => {
      if (e.key === "Enter") {
        if (this.input.value === this.data[this.stage].text) {
          this.stage = this.stage + 1;
          this.totalTime += new Date() - this.stageTime;

          if (this.stage === this.data.length) {
            clearTimeout(this.timerId);
            routerPush("/score", `?time=${this.totalTime / this.score}`);
          } else {
            this.leftTime = this.data[this.stage].second;
            this.updateRender();
            this.setTimer();
          }
        }
        this.input.value = "";
      }
    };

    this.getData().then((data) => {
      this.data = data;
      this.button.hidden = false;
      this.init();
      this.updateRender();
    });

    this.button.addEventListener("click", handleClick);
    this.input.addEventListener("keydown", handleKeydown);
  }

  init() {
    this.state = Game.State.READY;
    this.input.value = "";
    this.input.hidden = true;

    this.stage = 0;
    this.timerId && clearTimeout(this.timerId);
    this.leftTime = this.data[0].second;
    this.totalTime = 0;
    this.score = this.data.length;
    this.text = "Conan";
  }

  start() {
    this.state = Game.State.GAME;
    this.input.hidden = false;
    this.input.focus();

    this.setTimer();
  }

  setTimer() {
    this.stageTime = new Date();
    this.timerId && clearTimeout(this.timerId);
    this.timerId = setInterval(() => {
      this.leftTime = this.leftTime - 1;
      if (this.leftTime === 0) {
        this.stageTime = new Date();
        this.score = this.score - 1;
        this.stage = this.stage + 1;

        if (this.stage === this.data.length) {
          clearTimeout(this.timerId);
          routerPush("/score", `?time=${this.totalTime / this.score}`);
        } else {
          this.leftTime = this.data[this.stage].second;
        }
      }

      this.timerEl.innerHTML = this.leftTime;
      this.scoreEl.innerHTML = this.score;
      this.textEl.innerHTML = this.getStageText();

      this.updateRender();
    }, 1000);
  }

  getData() {
    return axios({
      url: "https://my-json-server.typicode.com/kakaopay-fe/resources/words",
      method: "get",
    }).then((response) => {
      return response.data;
    });
  }

  updateRender() {
    this.button.innerText = Game.ButtonLabel[this.state] || "";
    this.scoreEl.innerText = `점수 : ${this.score}점` || "";
    this.timerEl.innerText = `남은 시간 : ${this.leftTime}초` || "";
    this.textEl.innerText = this.getStageText();
  }

  getStageText() {
    if (!this.data) return "Loading...";
    if (this.state === Game.State.READY) return "Typing Game";
    return this.data[this.stage].text;
  }
}
customElements.define("game-view", GameView);
export default GameView;
