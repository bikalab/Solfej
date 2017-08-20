<p align="center">
  <img src="https://bikalab.github.io/solfej/img/solfej.png?raw=true" height="120" />
  <h3 align="center">Solfej Media Player</h3>
  </p>

Try this project, go to: https://bikalab.github.io/solfej/

## Resources
- Audio visualizer (modified): [HTML5 Audio Visualizer](https://github.com/Wayou/HTML5_Audio_Visualizer)
- Icons: [Material Design Icons](https://github.com/google/material-design-icons)

## Technologies used
- Web Audio API (visualizer)
- HTML `<video>` tag
- CSS variables
- Canvas

# Run as standalone app
In addition to being a web app, you can also run the Media Player as a standalone app using the Electron runtime.

To get started, you'll need NodeJS, Npm and optionally git.

### Install the Prerequisites
```
git clone https://github.com/bikalab/solfej
```
then run the following command in the root directory.
```
npm i
```

### Start

If nothing fails then you can run the app by typing:
```
npm start
```

### Bundling:

The bundles will appear in `dist/`.

* Current platform only: `npm run pack`
* Windows (both 32-bit and 64-bit): `npm run pack-win`
* macOS 64-bit: `npm run pack-osx`
* Linux (both 32-bit and 64-bit): `npm run pack-linux`
* For all 3 platforms: `npm run pack-all`
