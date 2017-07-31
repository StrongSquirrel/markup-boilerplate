# Markup boilerplate

Markup for project.

What we use:
- gulp for building project;
- twig templates with nunjucks to generate html-pages;
- less (with compressing and optimization via cleanCSS), base64 svg image including, postcss and autoprefixer for css-styles;
- rigger and uglify for building client scripts;
- imagemin for automatic PNG, JPEG, GIF and SVG images minification;
- gulp-connect as simple webserver with livereload for development.

## Requirements

1. `node >= 7.10`
2. `yarn >= 0.24`

## Install
### Install dependencies
```
yarn install
```

## Build
### Build project without watching changes
```
gulp build
```

### Build project + watching changes + start local webserver with livereload at localhost:3000
```
gulp
```

## Project structure
```
├── build               # Folder with builded project
│   ├── css/            # Builded and minified styles
│   ├── fonts/          # Fonts
│   ├── img/            # Images
│   ├── scripts/        # Builded and minified scripts
│   └── *.html          # Builded pages
├── src                 # Folder with source files
│   ├── css/            # Less-files
│   ├── favicons/       # Favicons
│   ├── fonts/          # Fonts
│   ├── img/            # Images
│   ├── scripts/        # Scripts
│   │   ├── app.js      # Script with list of scripts and libraries, that will be concatenated and minified
│   │   └── script.js   # Same as previous file, list of scripts that will be concatenated
│   └── templates/      # Twig templates
├── gulpfile.js         # Gulp scripts
├── package.json        # List of dependencies for building and developing project
├── readme.md           # Readme file
└── yarn.lock           # List of dependencies for yarn
```
