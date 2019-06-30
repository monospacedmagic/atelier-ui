# UiKit
First, you need to have installed Yarn, then
Run " yarn " command first to set up all the required modules.
Make sure to run " yarn add less " if the compiler errors on the first time.

# How to modify/work.
everything that will be added or changed will be inside the "/custom" folder in UiKit.
Do NOT try to modify the .css files, these are only generated files, only change the .less files.

# How to use.
Then use " yarn compile ". the compiler will output the editor theme in
"uikit/dist/css/uikit.amethyst-web-ui.min.css" then replace that in "editor/static/"