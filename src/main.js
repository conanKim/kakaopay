function component() {
  const element = document.getElementById("main");
  element.innerHTML = "HELLO WORLD";

  return element;
}

document.body.appendChild(component());
