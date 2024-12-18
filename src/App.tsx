import { createSignal, lazy, createResource } from "solid-js";
import {
  listen,
  emit,
  UnlistenFn,
  once,
  emitTo,
  EventName,
} from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

const getGreeting = async (name: string) => {
  // comms with tauri-rust backend
  let message: string = await invoke("greet", { name: name });
  return message;
};

import { Command } from "@tauri-apps/plugin-shell"; // run sidecar binary - deno hono api server
const runExtProg = async (name: string) => {
  const command = Command.sidecar("binaries/tauri-deno-solidjs");
  console.log(name, command);
  let { stdout } = await command.execute();
  return stdout;
};

const fetchDenos = async (id) => {
  // fetch data from - deno hono api server localhost:8000
  const response = await fetch(`http://localhost:8000/api/dinosaurs`);
  return response.text();
};

function App() {
  const [count, setCount] = createSignal(0);
  const [grOutput] = createResource("jake", getGreeting);
  const [output] = createResource("jake", runExtProg);
  const [getDenos] = createResource("", fetchDenos);
  // console.log(window);

  return (
    <div class="App">
      <img src="/vite-deno.svg" alt="Vite with Deno" width="75" />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" width="75" />
        </a>
        <a href="https://www.solidjs.com" target="_blank">
          <img
            src="/solid.svg"
            class="logo solid"
            alt="Solid logo"
            width="75"
          />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <b>text from tauri rust function : </b>
        <p>{grOutput()}</p>
        <b>output of tauri sidecar binary execution : </b>
        <p>{output()}</p>
        <b>response from deno compiled hono api server : </b>
        <p>{getDenos()}</p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </div>
  );
}

export default App;
