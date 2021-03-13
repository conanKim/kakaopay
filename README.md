# Kakao Pay Coding Test
## Typing Game

### 사용기술
* Vanilla Javascript
* Shadow-Dom
* mocha, chai, sinon

### 개선사항
* css 번들링이 되어 있지 않음.
  - Component 가 분리되어 있다 보니 style-loader 를 통해 번들링 된 style 은 shadow-dom 안에서 참조 할 수 없었음.
  - Shadow-dom 을 처음 써봐서 아직 방법을 모르는 것일 수도.. 구글링은 많이 해봤는데 원하는 정보를 찾지 못함.