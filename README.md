![editor](https://raw.githubusercontent.com/mralve/atelier-editor/master/repo-content/editor.png)

# The Atelier project
The editor is part of the Atelier project, the editor is referred to as Atelier-Ui, while Atelier-assets is the actual asset system that will be integrated into amethyst.

please partake in the very important MVP discussion regarding this repo,
https://community.amethyst.rs/t/atelier-mvp-discussion/1167


## Dev guide
You must have Rust, cargo, Node 10+, Yarn/NPM already installed.

This process will be changing imminently.

To run:
```
$ cd ui && yarn
$ yarn quasar dev
``` 
#### note the port that quasar launches on, eg. :7551
> ui/tauri.conf.js

```yaml
    build: {
      distDir: distDir,
      APP_URL: 'http://localhost:7551'  // must use a localhost server for now
    },
```

then:
```
$ yarn tauri dev
```

If you want to build it:
```
$ cd editor
$ cargo install --path node_modules/@tauri-apps/tauri/tools/rust/cargo-tauri-bundle --force
$ yarn tauri build
```
