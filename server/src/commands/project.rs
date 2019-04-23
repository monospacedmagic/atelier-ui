//! Contains functions related to creating a new project

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::PathBuf;

use crate::commands::templates;

/// Creates the skeleton of a new Amethyst project
pub fn create_new_project(
    name: String,
    path: String,
    author: String,
) -> Result<(), std::io::Error> {
    // First create the project directory and src subdirectory
    let path = path + &name + "/";
    let path_buf = PathBuf::from(path.clone() + "/src");
    fs::create_dir_all(path_buf)?;

    // Create the /resources subdirectory
    create_resources_dirctory(&path)?;

    // Write out the default Cargo.toml file
    let mut file = File::create(PathBuf::from(path.clone() + "/Cargo.toml"))?;
    let cargo_file = create_cargo_file(&name, &author)?;
    file.write_all(cargo_file.as_bytes())?;

    // Write out a basic main.rs file
    let mut file = File::create(PathBuf::from(path.clone() + "/src/main.rs"))?;
    let main_file = create_main_file()?;
    file.write_all(main_file.as_bytes())?;

    // Write out a simple display file in RON
    let mut file = File::create(PathBuf::from(path.clone() + "/resources/display.ron"))?;
    let ron_file = create_display_ron(&name)?;
    file.write_all(ron_file.as_bytes())?;
    Ok(())
}

// Creates the resources directory for a project
fn create_resources_dirctory(path: &str) -> Result<(), std::io::Error> {
    let path = PathBuf::from(path.to_string() + "/resources");
    fs::create_dir_all(path)?;
    Ok(())
}

// Creates a Cargo file for the project
fn create_cargo_file(project_name: &str, name: &str) -> Result<String, std::io::Error> {
    let cargo_template = templates::default_cargo_template(project_name, name);
    Ok(cargo_template)
}

// Creates a main.rs file for the project
fn create_main_file() -> Result<String, std::io::Error> {
    let main_template = templates::default_main_rs();
    Ok(main_template)
}

// Creates a basic RON file
fn create_display_ron(project_name: &str) -> Result<String, std::io::Error> {
    let ron_template = templates::default_display_ron(project_name);
    Ok(ron_template)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_create_display_ron() {
        let test_project_name = "test1";
        let display_ron = create_display_ron(&test_project_name).unwrap();
        assert_eq!(display_ron, "\n(\n    dimensions: Some((1024, 768)),\n    max_dimensions: None,\n    min_dimensions: None,\n    fullscreen: false,\n    multisampling: 0,\n    title: \"test1\",\n    visibility: true,\n    vsync: true,\n)");
    }

    #[test]
    fn test_create_cargo_file() {
        let test_project_name = "test1";
        let test_author = "Fletcher Haynes <fletcher@amethyst-engine.org>";
        let cargo_file = create_cargo_file(&test_project_name, &test_author).unwrap();
        assert_eq!(cargo_file, "\n[package]\nname = \"test1\"\nversion = \"0.1.0\"\nauthors = [\"Fletcher Haynes <fletcher@amethyst-engine.org>\"]\nedition = \"2018\"\n\n[dependencies]\n");
    }

    #[test]
    fn test_create_project() {
        let test_project_name = "test1".to_string();
        let test_author = "Fletcher Haynes <fletcher@amethyst-engine.org>".to_string();
        let path = env::temp_dir().to_str().unwrap().to_string();
        let result = create_new_project(test_project_name, path, test_author);
        assert!(result.is_ok());
    }
}
