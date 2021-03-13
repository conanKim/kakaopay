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

  state = Game.State.READY;

  constructor() {
    super();

    this.leftTime = 10;
    this.score = 10;
    this.text = "Conan";

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
  }
  connectedCallback() {
    this.button = this.shadowRoot.getElementById("button");
    this.input = this.shadowRoot.getElementById("input");
    this.scoreEl = this.shadowRoot.getElementById("score");
    this.timerEl = this.shadowRoot.getElementById("timer");

    const handleClick = () => {
      switch (this.state) {
        case Game.State.READY:
          this.start();
          break;
        case Game.State.GAME:
          if (this.input.value !== this.value) {
            this.input.value = "";
          }
          break;
      }
    };

    const handleKeydown = (e) => {
      if(e.key === 'Enter') {
        if (this.input.value !== this.value) {
          this.decreaseScore();
          this.input.value = "";
        }
      }
    }

    this.button.addEventListener("click", handleClick);
    this.input.addEventListener('keydown', handleKeydown);
  }
  decreaseScore() {
    this.score = this.score - 1;
    this.scoreEl.innerHTML = this.score;
  }
  start() {
    this.timerId = setInterval(() => {
      this.leftTime = this.leftTime - 1;
      if(this.leftTime === 0) {
        this.leftTime = 10;
        this.score = this.score - 1;
      }

      this.timerEl.innerHTML = this.leftTime;
      this.scoreEl.innerHTML = this.score;
    }, 1000);
    this.state = Game.State.GAME;
    this.button.innerHTML =
      Game.ButtonLabel[this.state];
  }
}
customElements.define("game-view", GameView);
export default GameView;
