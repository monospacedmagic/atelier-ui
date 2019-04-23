//! Contains functions that return formatted strings used to generate default files for new projects

/// Creates a basic Cargo file for the project
pub fn default_cargo_template(title: &str, author: &str) -> String {
    format!(
        r#"
[package]
name = "{}"
version = "0.1.0"
authors = ["{}"]
edition = "2018"

[dependencies]
"#,
        title, author
    )
    .to_string()
}

/// Creates a basic RON file with display properties
pub fn default_display_ron(title: &str) -> String {
    format!(
        r#"
(
    dimensions: Some((1024, 768)),
    max_dimensions: None,
    min_dimensions: None,
    fullscreen: false,
    multisampling: 0,
    title: "{}",
    visibility: true,
    vsync: true,
)"#,
        title
    )
    .to_string()
}

/// Creates a default main.rs file for a project
pub fn default_main_rs() -> String {
    format!(
        r#"
use amethyst;
#[macro_use]
extern crate log;

use amethyst::{{
    assets::{{PrefabLoader, PrefabLoaderSystem, Processor, RonFormat}},
    audio::{{output::init_output, Source}},
    core::{{transform::TransformBundle, Time}},
    ecs::prelude::{{Entity, System, Write}},
    input::{{is_close_requested, is_key_down, InputBundle}},
    prelude::*,
    renderer::{{DrawShaded, PosNormTex}},
    shrev::{{EventChannel, ReaderId}},
    ui::{{UiBundle, UiCreator, UiEvent, UiFinder, UiText}},
    utils::{{
        application_root_dir,
        fps_counter::{{FPSCounter, FPSCounterBundle}},
        scene::BasicScenePrefab,
    }},
    winit::VirtualKeyCode,
}};

fn main() -> amethyst::Result<()> {{
    amethyst::start_logger(Default::default());

    let app_root = application_root_dir()?;
    let resources = app_root.join("resources");

    // Game data builder goes here

    // End of game builder data
    game.run();
    Ok(())
}}

"#
    )
    .to_string()
}
