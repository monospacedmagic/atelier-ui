use std::env;
use std::fs;
use std::path::Path;

use web_view::*;

fn main() {
    web_view::builder()
        .title("Amethyst Editor")
        .content(web_view::Content::Url("http://localhost:8000/"))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, _arg| Ok(()))
        .run()
        .unwrap();
}
