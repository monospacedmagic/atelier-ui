mod cmd;

extern crate tauri;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;

fn main() {
  tauri::AppBuilder::new()
    .invoke_handler(|_webview, arg| {
      use cmd::Cmd::*;

      match serde_json::from_str(arg) {
        Err(_) => {}
        Ok(command) => {
          match command {
            // definitions for your custom commands from Cmd here
            MyCustomCommand { argument } => {
              //  your command code
              println!("MyCustomCommand works: {}", argument);
            }
          }
        }
      }

      let handle = _webview.handle();
      tauri::event::listen("hello", |msg| {

        #[derive(Serialize)]
        pub struct Reply {
          pub msg: String,
          pub rep: String
        }

        let reply = Reply {
          msg: format!("Rust says: {}", msg).to_string(),
          rep: "something else".to_string()
        };

        tauri::event::emit(handle, "reply",  serde_json::to_string(&reply).unwrap());

        println!("Message from emit:hello => {}", msg);
      });

    })
    .build()
    .run();
}
