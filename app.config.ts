import { defineConfig } from "@solidjs/start/config";
import { internalIpV4 } from "internal-ip";

import process from "node:process";
// import deno from "@deno/vite-plugin";
// import solid from "vite-plugin-solid";

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

const host = await internalIpV4();

let hmrPort = 5183;

// https://vitejs.dev/config/
export default defineConfig({
  ssr: false,
  server: { preset: "static" },
  vite: () => ({
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. tauri expects a fixed port, fail if that port is not available
    server: {
      host: mobile ? "0.0.0.0" : false, // listen on all addresses
      port: 1420,
      strictPort: true,
      hmr: mobile
        ? {
            protocol: "ws",
            host,
            port: hmrPort++,
          }
        : undefined,
      watch: {
        // 2. tell vite to ignore watching `src-tauri`
        ignored: ["**/_tauri/**"],
      },
    },

    // 3. to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
  }),
});

// https://docs.solidjs.com/solid-start/reference/config/define-config

// Parameters
// Property	Type	Default	Description
// ssr	boolean	true	Toggle between client and server rendering.
// solid	object		Configuration object for vite-plugin-solid
// extensions	string[]	["js", "jsx", "ts", "tsx"]	Array of file extensions to be treated as routes.
// server	object		Nitro server config options
// appRoot	string	"./src"	The path to the root of the application.
// routeDir	string	"./routes"	The path to where the routes are located.
// middleware	string		The path to an optional middleware file.
// devOverlay	boolean	true	Toggle the dev overlay.
// experimental.islands	boolean	false	Enable "islands" mode.
// vite	ViteConfig or ({ router })=>ViteConfig		Vite config object. Can be configured for each router which has the string value "server", "client" or "server-function"`

// export default defineConfig({
//   // nitro config
//   ssr: false,
//   // server: {
//   //   static: true,
//   //   prerender: {
//   //     ignore: [],
//   //     routes: ["/"], // array of routes
//   //     crawlLinks: true, // automatic route detection based on urls
//   //     failOnError: false,
//   //   },
//   //   routeRules: {
//   //     // "/blog/**": { swr: true },
//   //     // "/stories/**": { swr: true },
//   //     // "/top/**": { swr: true },
//   //     // "/show/**": { swr: true },
//   //     // "/users/**": { swr: true },
//   //     // '/blog/**': { swr: true },
//   //     // '/blog/**': { swr: 600 },
//   //     // '/blog/**': { static: true },
//   //     // '/blog/**': { cache: { /* cache options*/ } },
//   //     // '/assets/**': { headers: { 'cache-control': 's-maxage=0' } },
//   //     // '/api/v1/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
//   //     // '/old-page': { redirect: '/new-page' }, // uses status code 307 (Temporary Redirect)
//   //     // '/old-page2': { redirect: { to:'/new-page2', statusCode: 301 } },
//   //     // '/old-page/**': { redirect: '/new-page/**' },
//   //     // '/proxy/example': { proxy: 'https://example.com' },
//   //     // '/proxy/**': { proxy: '/api/**' },
//   //   },
//   // },
//   vite: {
//     // vite options
//     // plugins: [{ src: "apexcharts/dist/apexcharts.esm.js", mode: "server" }],
//     ssr: {
//       // noExternal: ["apexcharts"],
//     },
//     server: {
//       // https://vitejs.dev/config/server-options
//       proxy: {
//         // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
//         // "/var": "http://127.0.0.1:58080",
//         // "/etc": "http://127.0.0.1:58080",
//         // "/index.yaml": "http://127.0.0.1:58080",
//         // "/dummy": "http://127.0.0.1:58080",
//         // "/tnet": "http://localhost:58080",
//         // with options: http://localhost:5173/api/bar-> http://example.com/bar
//         // '/api': {
//         //   target: 'http://127.0.0.1:58080',
//         //   changeOrigin: true,
//         //   rewrite: (path) => path.replace(/^\/api/, ''),
//         // },
//         // with RegEx: http://localhost:5173/fallback/ -> http://example.com/
//         // "^/fallback/.*": {
//         //   target: "http://127.0.0.1:58080",
//         //   changeOrigin: true,
//         //   rewrite: (path) => path.replace(/^\/fallback/, ""),
//         // },
//         // Using the proxy instance
//         // '/api': {
//         //   target: 'http://127.0.0.1/58080',
//         //   changeOrigin: true,
//         //   configure: (proxy, options) => {
//         //     // proxy will be an instance of 'http-proxy'
//         //   },
//         // },
//         // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
//         //'/socket.io': {
//         //  target: 'ws://localhost:5174',
//         //  ws: true,
//         //},
//       },
//     },
//   },
// });
