![editor](https://raw.githubusercontent.com/mralve/atelier-editor/master/repo-content/editor.png)

# Summary

This is the official Editor for Amethyst


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
