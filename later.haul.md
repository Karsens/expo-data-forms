# #later

- Currently, testing this repo is very annoying because I have to go through NPM publish and download it on the other project. Normally, it should be possible to use `npm link` (see `http://matthewsessions.com/2017/10/27/developing-rn-module.html`), but it doesn't work because the Metro Bundler `doesn't support symlinks`. (Error I got: `Expected path {path} to be relative to one of the project roots`). A solution would be using `Haul` but until recently that didn't work with `Expo` unless you ejected your project. However, in this issue, the below comment states he got it working: `https://github.com/callstack/haul/issues/463`. Try this approach!
- [ ] Try haul for Dunbar: see dunbar `haul.js`
- [ ] Symlink both projects at the same time.
- [ ] See if I can update on the fly

# `index.js` inside codebase where you want to use symlinks:

```

import "haul/hot/patch";
import { KeepAwake, registerRootComponent } from "expo";
import App from "<insert the path to your main App file>";
import { makeHot, clearCacheFor, redraw } from "haul/hot";

const appFile = "<insert the path to your main App file>";

if (process.env.NODE_ENV === "development") {
KeepAwake.activate();
}

registerRootComponent(makeHot(() => App)());

if (module.hot) {
module.hot.accept(() => {});
module.hot.accept([appFile], () => {
clearCacheFor(require.resolve(appFile));
redraw(() => require(appFile).default);
});
// do the same for react-navigation screens
}

```

# `package.json` script

"watch": "haul start --platform=all --port=19001",

# app.json under expo key:

```
        "packagerOpts": {
           "port": 19001
         },
```
