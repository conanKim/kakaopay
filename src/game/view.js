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
  timer;
  score;
  text;
  value = "";

  constructor() {
    super();

    this.timer = 10;
    this.score = 10;
    this.text = "Conan";

    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="game" id="root">
          <div class="header" id="header">
            <span id="timer">${this.timer}</span>
            <span id="score">${this.score}</span>
          </div>
          <div id="body">
            <span class='text' id="text">${this.text}</span>
            <input id='input' value="${this.value}" />
            <button id="button">시작</button>
          </div>
        </div>
      `;
  }
  connectedCallback() {
    const button = this.shadowRoot.getElementById("button");
    const input = this.shadowRoot.getElementById("input");

    const checkAnswer = () => {
      if(input.value !== this.value) {
        this.decreaseScore();
      }
    };

    button.addEventListener("click", checkAnswer);
  }
  decreaseScore() {
    this.score = this.score - 1;
    this.shadowRoot.getElementById("score").innerHTML = this.score;
  }
}
customElements.define("game-view", GameView);
export default GameView;
