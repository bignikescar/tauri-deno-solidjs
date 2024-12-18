use tauri_plugin_shell::ShellExt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// #[tauri::command]
// async fn start_deno(app: tauri::AppHandle) {
//   let sidecar_command = app
//     .shell()
//     .sidecar("binaries/denort")
//     .unwrap();
//     // .args(["arg1", "-a", "--arg2", "any-string-that-matches-the-validator"]);
//   let (mut _rx, mut _child) = sidecar_command.spawn().unwrap();
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cors_fetch::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        // .invoke_handler(tauri::generate_handler![start_deno])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// use tauri_plugin_shell::ShellExt;
// use tauri_plugin_shell::process::CommandEvent;

// let sidecar_command = app.shell().sidecar("my-sidecar").unwrap();
// let (mut rx, mut _child) = sidecar_command
//   .spawn()
//   .expect("Failed to spawn sidecar");

// tauri::async_runtime::spawn(async move {
//   // read events such as stdout
//   while let Some(event) = rx.recv().await {
//     if let CommandEvent::Stdout(line_bytes) = event {
//       let line = String::from_utf8_lossy(&line_bytes);
//       window
//         .emit("message", Some(format!("'{}'", line)))
//         .expect("failed to emit event");
//       // write to stdin
//       child.write("message from Rust\n".as_bytes()).unwrap();
//     }
//   }
// });
