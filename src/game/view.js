class GameView extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
        <div class="game" id="root">
          <div class="header" id="header">
          GAME VIEW
          </div>
          <div id="body">
          </div>
        </div>
      `;
  }
}
customElements.define("game-view", GameView);
export default GameView;
