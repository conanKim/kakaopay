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
    const button = this.shadowRoot.getElementById("button");
    const input = this.shadowRoot.getElementById("input");

    const handleClick = () => {
      switch (this.state) {
        case Game.State.READY:
          this.start();
          break;
        case Game.State.GAME:
          if (input.value !== this.value) {
            this.decreaseScore();
          }
          break;
      }
    };

    button.addEventListener("click", handleClick);
  }
  decreaseScore() {
    this.score = this.score - 1;
    this.shadowRoot.getElementById("score").innerHTML = this.score;
  }
  start() {
    this.timerId = setInterval(() => {
      this.leftTime = this.leftTime - 1;
      this.shadowRoot.getElementById("timer").innerHTML = this.leftTime;
    }, 1000);
    this.state = Game.State.GAME;
    this.shadowRoot.getElementById("button").innerHTML =
      Game.ButtonLabel[this.state];
  }
}
customElements.define("game-view", GameView);
export default GameView;
