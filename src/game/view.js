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
  text;
  value = "";

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
            <span id="timer">${this.leftTime}</span>
            <span id="score">${this.score}</span>
          </div>
          <div id="body">
            <span class='text' id="text">${this.text}</span>
            <input id='input' value="${this.value}" />
            <button id="button">${Game.ButtonLabel[this.state]}</button>
          </div>
        </div>
      `;

    this.init();
  }

  init() {
    this.state = Game.State.READY;

    this.leftTime = 10;
    this.score = 10;
    this.text = "Conan";
    this.timerId && clearTimeout(this.timerId);
  }

  start() {
    this.timerId = setInterval(() => {
      this.leftTime = this.leftTime - 1;
      if (this.leftTime === 0) {
        this.leftTime = 10;
        this.score = this.score - 1;
      }

      this.timerEl.innerHTML = this.leftTime;
      this.scoreEl.innerHTML = this.score;

      this.updateRender();
    }, 1000);
    this.state = Game.State.GAME;
  }

  updateRender() {
    this.button.innerText = Game.ButtonLabel[this.state];
    this.scoreEl.innerText = this.score;
    this.timerEl.innerText = this.leftTime;
    this.textEl.innerText = this.text;
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
        if (this.input.value !== this.value) {
          this.input.value = "";
        }
      }
    };

    this.button.addEventListener("click", handleClick);
    this.input.addEventListener("keydown", handleKeydown);

    this.updateRender();
  }
}
customElements.define("game-view", GameView);
export default GameView;
