import { render } from "preact";

const test = (
  <div dc-root='true'>
    <h2>Hi!</h2>
  </div>
);

if (typeof window !== "undefined") {
  render(test, document.body);
}
