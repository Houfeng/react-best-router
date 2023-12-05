import { JSDOM } from "jsdom";

const dom = new JSDOM(
  `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
  { url: "http://localhost/" },
);

const window = dom.window;
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
