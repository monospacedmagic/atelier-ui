atelier-editor:
	@echo "Building editor..."
	cargo web build -p editor
	@echo "Editor built!"
	cp target/wasm32-unknown-unknown/debug/main.js files/
	cp target/wasm32-unknown-unknown/debug/main.wasm files/

atelier-server:
	@echo "Building server..."
	cargo build -p server
	@echo "Server built!"
	cp target/debug/server /usr/local/bin/atelier-server
	chmod ugo+x /usr/local/bin/atelier-server

atelier-webview:
	@echo "Building webview..."
	cargo build -p webview
	@echo "Webview built!"
	cp target/debug/webview /usr/local/bin/atelier-webview
	chmod ugo+x /usr/local/bin/atelier-webview

all: atelier-editor atelier-server atelier-webview