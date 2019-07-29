This is where resides all that is web (CSS, JS, fonts...).

## Prereqisites
Make sure you have [node](https://nodejs.org/en/) installed.

## Build
After making changes run `npm run build`. This takes care of:
- Compiling Less to CSS
- Compvert ES6 to JavaScript supported by older browsers
- Minifying and bundling all JS and CSS files and placing them in `static/index.js`
- Genreate HTML (`static/index.html`) from the provided template (`ui/index.html`)

To save the effort of manullay building everytime a change is done, use `npm run start`. This will automatically run the build whenever a change is done and saved.

## Managing Dependencies
Run `npm i` to get all the dependencies (see `ui/package.json`). This needs to be run everytime a dependecy is added / modified.