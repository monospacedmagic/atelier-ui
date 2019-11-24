use serde_derive::{Deserialize, Serialize};
use std::error::Error;
use std::fs;
use std::io;

/// This is the toml struct that stores data about opened projects locally
#[derive(Deserialize, Serialize)]
pub struct EditorLocalStorage{
    pub LocalProject: Vec<EditorProjectReference>,
}

#[derive(Deserialize, Serialize)]
/// A reference to a project that is stored locally.
pub struct EditorProjectReference{
    pub ProjectName: String,
    /// Path to the root dir where Amethyst.toml is found.
    pub ProjectPath: String,
    pub ProjectEngineVersion: f32,
    /// Date and time.
    pub ProjectLastModified: String
}

/// Deserialize the settings from path
pub fn deserialize(path: String) -> Result<EditorLocalStorage, io::Error> {
 
    let mut string_data = String::new();
    string_data = match fs::read_to_string(&path){
        Err(err) => panic!("couldn't read {}: {}", &path, err.description()),
        Ok(file_data) => { file_data },
    };

    let config: EditorLocalStorage = toml::from_str(&string_data).unwrap();
    Ok(config)
}

/// Serializes the settings to path or creates a new toml file.
pub fn serialize(path: String, config: EditorLocalStorage) -> Result<(), io::Error> {
    
    match fs::write(&path, toml::to_string(&config).unwrap()){
        Err(err) => panic!("couldn't write {}: {}", &path, err.description()),
        Ok(file_data) => { Ok(()) },
    }
}