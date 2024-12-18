/* @refresh reload */
import "./main.css";
import "./App.css";
import { render } from "solid-js/web";
import App from "./App.tsx";

render(() => <App />, document.getElementById("root") as HTMLElement);
