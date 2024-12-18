## Build Deno compiled hono backend server

```bash
deno run compile
```

## Tauri Dev Mode

```bash
deno run tauri dev
```

## branches

master branch : bare solidjs<br/>
solidstart branch : solidstart bare example<br/>
solid-start-with-prisma branch : prisma on solid start on vinxi not working. due to prisma client and pg npm moule does not export esm type js which requires on vinxi and vite.<br/>
solid-start-deno-tauri branch : run solid hono server from deno compiled binary as tauri sidecar<br/>

## cors

in tauri v2, dont know howto disable cors or enable access to localhost:1420 and localhost:8000, used tauri-plugin-cors-fetch tauri plugin crate.
