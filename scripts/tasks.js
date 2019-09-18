/**
 * Created by Sergiu Ghenciu on 06/11/2018
 */

const path = require('path');
const crypto = require('crypto');
const {appRoot} = require('./config');

/* prod dependencies */
const sass = require('node-sass');
const csso = require('csso');

const {
  keys, merge, concat, prop, read, write, scanDir, is, not, test, either, mkDirR, dest, copy,
} = require('./utils.js');


const _compileScss = (file, destination) => {
  return read(file)
    .then((x) => sass.renderSync({data: x, file: file}))
    .then(prop('css'))
    .then(write(destination));
};

const _compressCss = (file, destination) => {
  return read(file)
    .then(csso.minify)
    .then(prop('css'))
    .then(write(destination));
};


/* ------------------------------------------------------ */
/* ----------- customised tasks (per project) ----------- */
/* ------------------------------------------------------ */
const prepareVendors = () => {
  mkDirR('customized-vendors/materialize/dist'.split('/'));
  return Promise.all([
    _compileScss(
      'customized-vendors/materialize/sass/materialize.scss',
      'customized-vendors/materialize/dist/materialize.css'
    ),
  ]);
};

// const compileScss = () => {
//   return Promise.all(
//     scanDir('src')
//       .filter(is('.scss'))
//       .filter(not(test(/_.*\.scss/)))
//       .map((file) => _compileScss(file, file.replace(/\.scss$/, '.css')))
//   );
// };

const compileScss = () => {
  return Promise.all([
    _compileScss(
      'app.scss',
      'app.css'
    ),
  ]);
};

const compressCss = () => {
  return Promise.all(
    scanDir('customized-vendors')
      .filter(is('.css'))
      .filter(not(is('.min.css')))
      .map((file) => _compressCss(file, file.replace(/\.css$/, '.min.css')))
  );
};



module.exports = {
  _compileScss,
  compileScss,
  compressCss,
  prepareVendors,
};
