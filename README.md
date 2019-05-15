![editor](https://user-images.githubusercontent.com/1938040/57751719-ec44d380-76e6-11e9-9d1e-04b2b2fc6577.png)

# Summary

This repo contains the editor component of Atelier. It is comprised of three crates:

1. The front-end WASM application
2. A server component that the front-end talks to via websockets
3. A package that uses `web_view` to serve the WASM application up in a platform-native browser window so that it looks like a native application

## Overall Architecture

```
Webview Window───────────────────────┐                        
│                                    │                        
│     ┌─────────────────────────┐    │                        
│     │                         │    │                        
│     │     WASM Front-end      │    │◀─┐                     
│     │                         │    │  │                     
│     └─────────────────────────┘    │  │                     
│                  ▲                 │  │                     
└──────────────────╋─────────────────┘  │                     
                   ┃                    │                     
                   ┃                    │                     
                   ┃ Websockets         │   HTTP File Serving 
                   ┃                    │                     
                   ┃                    │                     
                   ▼                    │                     
┌────────────────────────────────────┐  │                     
│                                    │  │                     
│                                    │  │                     
│               Server               │──┘                     
│                                    │                        
│                                    │                        
└────────────────────────────────────┘                        
                   ▲                                          
                   │                                          
                   │ OS commands                              
                   │                                          
                   ▼                                          
┌────────────────────────────────────┐                        
│          Host Filesystem           │                        
└────────────────────────────────────┘                        
```

### Startup

The startup sequence looks like this:

1. User launches the web_view executable
2. The web_view executable starts and launches the server process
    - The web_view exeutable waits until it can reach the server via its embedded HTTP server
3. The web_view executable loads `index.html`
4. `index.html` loads the UIKit CSS and JS
5. `index.html` then loads `main.js`
6. `main.js` makes an HTTP request to the server for `main.wasm`
7. The WASM front-end is loaded into the `web_view` window
8. The WASM front-end establishes a websocket connection to the server
    - This is so that the front-end can interact with the host system, similar to how Electron functions

### Resources

`web_view` is significantly lighter weight than a CEF window. It uses platform-specific browser windows: Cocoa/WebKit on macOS, gtk-webkit2 on Linux and MSHTML (IE10/11) on Windows. As of the date of this writing, it consumes around 30MB of RAM.

## yew_editor

This crate contains the WASM front-end application. It uses the [Yew](https://github.com/DenisKolodin/yew) framework, and functions much like Angular, Elm, and React. This crate uses the `cargo-web` cargo extension to compile for WASM.

### UI

The UI is just plain UIKit, utilized by the WASM application.

## yew_server

This crate contains the server component. It listens for commands from the front-end on `127.0.0.1` via websockets, and executes them on behalf of the front-end. This is because WASM/JS apps cannot interact much with the host for security reasons.

## yew_web_view

This contains the `web_view` component, and is the one the user will launch. This crate is rather simple and is just to provide the window.

## As a Non-Local Editor

The application can be run without the server and web_view component by using nginx or similar to serve the WASM application. When used in this fashion, the WASM application is limited in what it can do. For example, the browser places limits on how much storage can be used by an application.

We attempt to keep feature parity between the local and non-local versions, but this isn't always possible. The areas where they differ are called out in the book.
