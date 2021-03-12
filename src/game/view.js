import "../style.css";
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
`
;

class GameView extends HTMLElement {
  timer;
  score;
  text;

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
            <input />
            <button>시작</button>
          </div>
        </div>
      `;
  }
}
customElements.define("game-view", GameView);
export default GameView;
