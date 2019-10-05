use serde_derive::{Deserialize, Serialize};
use std::error::Error;
use std::fs;
use std::io;

/// The general settings for the project.
#[derive(Deserialize, Serialize)]
pub struct Project {
    pub project_name: String,
    pub project_author: String,
    pub project_version: f32,
    pub project_graphics_api: String,
}

/// The general settings for the editor.
#[derive(Deserialize, Serialize)]
pub struct Editor {
    pub editor_default_scene: String,
}

/// The general settings for the Engine.
#[derive(Deserialize, Serialize)]
pub struct Engine {

    pub engine_version: f32,
}

/// The actual toml data structure
#[derive(Deserialize, Serialize)]
pub struct AmethystProject{
    pub ProjectConfig: Project,
    pub EditorConfig: Editor,
    pub EngineConfig: Engine
}

/// Deserialize the settings from path
pub fn amethystProject_Deserialize(path: String) -> Result<AmethystProject, io::Error> {
 
    let mut string_data = String::new();
    string_data = match fs::read_to_string(&path){
        Err(err) => panic!("couldn't read {}: {}", &path, err.description()),
        Ok(file_data) => { file_data },
    };

    let config: AmethystProject = toml::from_str(&string_data).unwrap();
    Ok(config)
}

/// Serializes the settings to path
pub fn amethystProject_Serialize(path: String, config: AmethystProject) -> Result<(), io::Error> {
    
    match fs::write(&path, toml::to_string(&config).unwrap()){
        Err(err) => panic!("couldn't write {}: {}", &path, err.description()),
        Ok(file_data) => { Ok(()) },
    }
}