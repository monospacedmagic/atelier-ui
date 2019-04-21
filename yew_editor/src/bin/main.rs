#![recursion_limit = "128"]

extern crate yew;
extern crate web_logger;
extern crate yew_editor;

use yew::prelude::*;
use yew_editor::core::model::Model;

fn main() {
    web_logger::init();
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
