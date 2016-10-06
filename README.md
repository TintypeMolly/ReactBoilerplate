# react-boilerplate

My small react boilerplate.  
I want to make an universal(isomorphic) app project template using [react](https://facebook.github.io/react/) and [redux](http://redux.js.org/).  
This repo is hugely influenced by [react-starter-kit](https://github.com/kriasoft/react-starter-kit) of [Kriasoft](https://github.com/kriasoft).

## Why I made this

I used [react-starter-kit](https://github.com/kriasoft/react-starter-kit) when I first met [node](https://nodejs.org/) and [react](https://facebook.github.io/react/), and found it too complicated to read.  
I managed to publish a universal app with its help, but I still don't understand its structure.  
So I decided to make a very simple and easy universal react app boilerplate.

## How to use

This is **not a library** so don't put this on `dependencies` or `devDependencies`.  

### A rough guideline

1. Edit `package.json` and `src/config.js` with your project name and description.
2. Edit the page structures in `src/components/structures`.
3. Add some pages on `src/components/pages`.
4. Add that pages into route, which is `src/routes.js`.
5. `npm start` to run in development mode with HMR.
6. `npm run build` to release.

### Quick Start

```
git clone git+https://github.com/TintypeMolly/react-boilerplate.git
mv react-boilerplate <your_project_name>
cd your_project_name
npm install
npm start
```

It runs this project in development(debug) mode.

### Release Build

```
npm run build
node build/server.js
```

`npm run build` builds the project into `/path/to/project/build`.  
The build result doesn't depend on any other packages.  
So you can just move it to another place and run `node /some/path/server.js`.

### Utilities

#### clean

```
npm run clean
npm run clean -- --all
```

You can clean your build result.  
Given `--all` option to `npm run clean`, it will delete build result of favicon too.  
Without it, it removes `build/` only.

#### favicon

```
npm run favicon
```

This project builds many different sizes of favicon using [favicons](https://github.com/haydenbleasel/favicons).  
`npm run build` automatically builds favicon when favicon meta file doesn't exist.  
But if you want to manually build your favicon, run this command.

#### eslint

```
npm run eslint .                  # run eslint on current directory
npm run eslint -- .               # same as above
npm run eslint some/src/path      # run eslint on some/src/path
npm run eslint -- some/src/path   # same as above
npm run eslint -- . --fix         # fix at the same time
```

You can edit eslint config on `.eslintrc.json`.

## TODOs

1. Build a fine redux example
2. Design a sample homepage
3. Add test framework
