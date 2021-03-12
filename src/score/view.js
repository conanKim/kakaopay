class ScoreView extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
        <div class="score" id="root">
          <div class="header" id="header">
          SCORE VIEW
          </div>
          <div id="body">
          </div>
        </div>
      `;
  }
}
customElements.define("score-view", ScoreView);
export default ScoreView;
