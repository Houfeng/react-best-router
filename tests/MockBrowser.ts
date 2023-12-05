import { Window } from "happy-dom";

const window = new Window({
  url: "https://localhost:8080",
  width: 1024,
  height: 768,
});

const document = window.document;
const navigator = window.navigator;
const location = window.location;
const history = window.history;

Object.assign(global, {
  window,
  document,
  navigator,
  location,
  history,
});

const root = document.createElement("div");
root.id = "root";
document.body.append(root);
