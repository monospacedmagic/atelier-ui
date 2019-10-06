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
$ quasar dev
``` 
#### note the port that quasar launches on, eg. :8080 
> edit ui/tauri.conf.js

```yaml
    build: {
      distDir: distDir,
      APP_URL: 'http://localhost:8080'  // must use a localhost server for now
    },
```

then:
```
$ tauri dev
```
