# NerdyStack/Client
Front-end client module of NerdyStack by thenerdyguy.

# Commit Notes

## Implemented working NerdyComponents prototype

`hello-world.tsx` defines a custom element, required in index.ts by `import 'hello-world.html'` which has `<script src='./hello-world.tsx' defer/>` all resolved by Webpack.

Testing was successful using webpack-dev-server through npm start in client folder, through http-serve and even using `file://...index.html` in Chrome (56), creating the element using TSX, `new ...()`, `createElement`, and even injecting in `innerHTML`.

Polymer and Polymer.Element is included in webpack's `app.js` bundle (80.6 kB).

Wow!
