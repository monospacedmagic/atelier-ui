editor:
	@echo "Building editor..."
	cargo web build -p yew_editor --release
	@echo "Editor build!"

server:
	@echo "Building server..."
	cargo build -p yew_server --release
	@echo "Server built!"

webview:
	@echo "Building webview..."
	cargo build -p yew_web_view --release
	@echo "Webview built!"

all: server editor webview