#![recursion_limit = "128"]

extern crate yew;
extern crate web_logger;
extern crate editor;

use yew::prelude::*;
use editor::core::model::Model;

fn main() {
    web_logger::init();
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
