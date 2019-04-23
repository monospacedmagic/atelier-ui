use yew::format::Json;
use yew::prelude::*;
use yew::services::storage::Area;
use yew::services::StorageService;

use serde_derive::{Deserialize, Serialize};

const PROJECT_STORE_KEY: &str = "org.amethyst-engine.projects";

pub enum Msg {}

pub struct ProjectStore {
    key: &'static str,
    storage: StorageService,
    database: ProjectDatabase,
}

#[derive(Clone, Default, Debug, Serialize, Deserialize)]
pub struct ProjectDatabase {
    projects: Vec<Project>,
}

impl ProjectDatabase {
    pub fn new() -> ProjectDatabase {
        ProjectDatabase { projects: vec![] }
    }
}

impl ProjectStore {
    pub fn new() -> ProjectStore {
        ProjectStore {
            key: PROJECT_STORE_KEY,
            storage: StorageService::new(Area::Local),
            database: ProjectDatabase::new(),
        }
    }

    /// Adds a project to the storage. Note that this only adds it to the local browser storage.
    pub fn add_project(&mut self, name: &str) {
        let new_project = Project::new(name);
        self.database.projects.push(new_project);
        let json_data = Json(&self.database.projects);
        self.storage.store(self.key, json_data);
    }

    /// Checks if a project exists or not. Note that this only checks local browser storage.
    pub fn project_exists(&self, name: &str) -> bool {
        for project in &self.database.projects {
            if project.name == name {
                return true;
            }
        }
        false
    }
}

impl Default for ProjectStore {
    fn default() -> Self {
        Self::new()
    }
}

impl Component for ProjectStore {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, _: ComponentLink<Self>) -> Self {
        let mut storage = StorageService::new(Area::Local);
        let Json(database) = storage.restore(PROJECT_STORE_KEY);
        let database = database.unwrap_or_else(|_| ProjectDatabase::new());
        ProjectStore {
            key: PROJECT_STORE_KEY,
            storage,
            database,
        }
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        true
    }
}

/// Model that represents an entire Project and its resources
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Project {
    name: String,
}

impl Project {
    pub fn new(name: &str) -> Project {
        Project {
            name: name.to_string(),
        }
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize)]
pub struct Prefab {}

impl Prefab {
    pub fn new() -> Prefab {
        Prefab {}
    }
}
