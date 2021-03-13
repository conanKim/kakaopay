import { Game } from "../constant";

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
  height: 30px;
  font-size: 30px;
}
button {
  margin: 10px;
  width: 50px;
  height: 30px;
}
`;

class GameView extends HTMLElement {
  leftTime;
  timerId;
  score;
  stage = 0;
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
            <button id="button" hidden="true">${Game.ButtonLabel[this.state]}</button>
          </div>
        </div>
      `;
  }

  init() {
    this.state = Game.State.READY;
    this.input.value = "";
    this.input.hidden = true;

    this.stage = 0;
    this.timerId && clearTimeout(this.timerId);
    this.leftTime = this.data[0].time;
    this.score = this.data.length;
    this.text = "Conan";
  }

  start() {
    this.state = Game.State.GAME;
    this.input.hidden = false;

    this.timerId = setInterval(() => {
      this.leftTime = this.leftTime - 1;
      if (this.leftTime === 0) {
        this.score = this.score - 1;
        this.stage = this.stage + 1;
        this.leftTime = this.data[this.stage].time;
      }

      this.timerEl.innerHTML = this.leftTime;
      this.scoreEl.innerHTML = this.score;
      this.textEl.innerHTML = this.getStageText();

      this.updateRender();
    }, 1000);
  }

  getData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            time: 10,
            text: "hello",
          },
          {
            time: 15,
            text: "world",
          },
        ]);
      }, 2000);
    });
  }

  updateRender() {
    this.button.innerText = Game.ButtonLabel[this.state] || "";
    this.scoreEl.innerText = this.score || "";
    this.timerEl.innerText = this.leftTime || "";
    this.textEl.innerText = this.getStageText();
  }

  getStageText() {
    if (!this.data) return "Loading...";
    if (this.state === Game.State.READY) return "Typing Game";
    return this.data[this.stage].text;
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
        if (this.input.value !== this.data[this.stage].text) {
          this.input.value = "";
        }
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
}
customElements.define("game-view", GameView);
export default GameView;
