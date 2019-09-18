/**
 * Created by Sergiu Ghenciu on 08/12/2017
 */

const fs = require('fs');
const path = require('path');
const {appRoot} = require('./config');

/* ------------------------------------------------------ */
/* ----------------------- Helpers ---------------------- */
/* ------------------------------------------------------ */
const length = (x) => x.length;
const isArray = (x) => Array.isArray(x);
/* concat() does not change the existing arrays, but instead returns a new array */
const concat = (b, a) => a.concat(b); // [1].concat([2]) -> [1, 2] 
const push = (b, a) => a.concat(b); // [1].concat(2) -> [1, 2] 
const includes = (x, xs) => xs.includes(x);
const map = (f, xs) => xs.map(f);
const curry = (fn, a = []) => (...b) => {
    const args = concat(b, a);
    if (length(args) < length(fn)) {
      return curry(fn, args);
    }
    return fn(...args);
  };
const has = (x, obj) => obj.hasOwnProperty(x);
const keys = (x) => Object.keys(x);
const merge = (b, a) => Object.assign(a, b);
const head = (xs) => xs[0];
const last = (xs) => xs[length(xs) - 1];
const tail = (xs) => xs.slice(1);
const pipe = (...fns) => (init) => fns.reduce((a, fn) => fn(a), init);
const pipeP = (f, g) => (x) => f(x).then(g);
const promiseSerial = (...xs) => tail(xs).reduce(pipeP, head(xs));
const def = (x) => typeof x !== 'undefined';
const undef = (x) => !def(x);
const test = (regexp, x) => regexp.test(x);
const either = (predicates, x) => predicates.some((f) => f(x));
const not = (pred, x) => !pred(x);
const prop = (x, obj) => obj[x];
const isPrefixOf = (b, a) => a.substring(0, length(b)) === b; // (src, src/foo) -> true
const isSuffixOf = (b, a) => a.substring(length(a) - length(b), length(a)) === b; // (.js, foo.js) -> true
const is = (ext, file) => isSuffixOf(ext, file);
const isNot = (ext, file) => !isSuffixOf(ext, file);
const once = (fn) => {
  let called = false;
  let r;
  return (...args) => {
    if (called) {
      return r;
    }
    called = true;
    r = fn(...args);
    return r;
  };
};
const memoizeWith = (mFn, fn) => {
    const cache = {};
    return (...args) => {
      const key = mFn(...args);
      if (!has(key, cache)) {
        cache[key] = fn(...args);
        // console.log(key, '->', cache[key]);
      }
      return cache[key];
    };
  };
const flatten = (xs) => xs.reduce((a, x) => {
    if (isArray(x)) {
      return concat(x, a);
    } else {
      return push(x, a);
    }
  }, []);
const maxBy = (f, xs) => xs.reduce((a, x) => Math.max(a, f(x)), 0);
const pad = (x, n, a = '') => n > 0 ? pad(x, n - 1, `${a}${x}`) : a;
// Array.prototype.reject = function(fn) {
//   return this.filter(not(fn));
// };

const yellow = (x) => `\x1b[33m${x}\x1b[0m`;
const green = (x) => `\x1b[32m${x}\x1b[0m`;
const red = (x) => `\x1b[31m${x}\x1b[0m`;
const magenta = (x) => `\x1b[35m${x}\x1b[0m`;
const cyan = (x) => `\x1b[36m${x}\x1b[0m`;

const scanDir = (dir) => {
  return fs
    .readdirSync(dir)
    .reduce(
      (a, x) =>
        fs.statSync(path.join(dir, x)).isDirectory()
          ? push(scanDir(path.join(dir, x)), a)
          : push(path.join(dir, x), a),
      []
    );
};

const mkDirR = (xs, existMap = {}, a = '', i = 0) => {
  if (i >= length(xs)) {
    return;
  }
  a += xs[i] + path.sep;

  if (undef(existMap[a])) {
    existMap[a] = true;
    try {
      fs.mkdirSync(a);
      // console.log('-- made ------', a);
    } catch (e) {
      // if (e.code === 'EEXIST') {
      //   console.log('---- exists ---', a);
      // }
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  } else {
    // console.log('------- skip - ', a);
  }

  mkDirR(xs, existMap, a, i + 1);
};
// let existMap = {};
// mkDirR(['a', 'a', 'a'], existMap);
// mkDirR(['a', 'a', 'b'], existMap);
// mkDirR(['a', 'b', 'a'], existMap);
// mkDirR(['a', 'b', 'b'], existMap);
// mkDirR(['b', 'c', 'd', 'e', 'f'], existMap);

const read = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
};

const write = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const copy = (source, target) => {
  return new Promise((resolve, reject) => {
    let end = false;
    let done = (err) => {
      if (!end) {
        err ? reject(err) : resolve();
        end = true;
      }
    };

    let rd = fs.createReadStream(source);
    rd.on('error', function(err) {
      done(err);
    });
    let wr = fs.createWriteStream(target);
    wr.on('error', function(err) {
      done(err);
    });
    wr.on('close', function() {
      done(null);
    });
    rd.pipe(wr);
  });
};

const dest = (from, to) => {
  // console.log('------ from --- ' + from + ' --- to --- ' + to);
  let existMap = {};
  const destPath = path.resolve(appRoot, to);
  // console.log('------ appRoot ', appRoot);
  // console.log('------ destPath', destPath);

  // does not make much sense
  // just reminds you that there is room for optimisation
  mkDirR(path.relative(appRoot, destPath).split(path.sep), existMap);

  return (file) => {
    const x = file.replace(from, to);
    const f = path.relative(appRoot, path.dirname(x));

    mkDirR(f.split(path.sep), existMap);

    return x;
  };
};

const watch = (options = {}) => {
  const opt = merge(
    options,
    {persistent: true, interval: 200, encoding: 'utf8'}
  );

  return (files, cb) => {
    return files.map((x) =>
      fs.watchFile(x, opt, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
          cb(x);
        }
      })
    );
  };
};

const unwatch = (files, cb) => {
  return files.map((x) => fs.unwatchFile(x, cb));
};

const runFactory = (options) => {
  const spawn = require('child_process').spawn;
  const getCwd = () => process.env.PWD || process.cwd();

  if (undef(options.cwd)) options.cwd = getCwd();

  return (command, args) => {
    return new Promise((resolve, reject) => {
      let cmd = spawn(command, args, options);
      // catch exceptions so node doesn't exit prematurely,
      // leaving a runaway process
      process.on('uncaughtException', (err) => {
        // console.error(err.stack);
        cmd.kill('SIGHUP');
      });

      let stdout = '';
      let stderr = '';

      cmd.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      cmd.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      cmd.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(stderr);
        }
      });
    });
  };
};

module.exports = {
  length,
  keys,
  merge: curry(merge),
  head,
  last,
  tail,
  isArray,
  concat: curry(concat),
  push: curry(push),
  includes: curry(includes),
  map: curry(map),
  flatten,
  pipe,
  pipeP,
  promiseSerial,
  def,
  undef,
  test: curry(test),
  either: curry(test),
  not: curry(not),
  prop: curry(prop),
  isPrefixOf: curry(isPrefixOf),
  isSuffixOf: curry(isSuffixOf),
  is: curry(is),
  isNot: curry(isNot),
  once,
  memoizeWith,
  maxBy: curry(maxBy),
  pad: pad,

  yellow,
  green,
  red,
  cyan,
  magenta,

  scanDir,
  mkDirR,
  read,
  write: curry(write),
  copy,
  dest,
  watch,
  unwatch,
  runFactory,
};

// gulp.task('glob-test', () => {
//   const nodeGlob = require('glob');
//   const miniMatch = require('minimatch');
//
//   const globIsNotConflicting = (a) => (b) => !miniMatch(a, b);
//
//   const globIsNegative = (x) => {
//     if (!isString(x) || x[0] === '!') {
//       return true;
//     }
//     return false;
//   };
//
//   const globIsPositive = (x) => !globIsNegative(x);
//
//   const globRemoveNegation = (x) => globIsNegative(x) ? x.slice(1) : x;
//
//   const globUnRelative = (cwd, x) => {
//     let mod = '';
//     if (x[0] === '!') {
//       mod = x[0];
//       x = x.slice(1);
//     }
//     return mod + path.resolve(cwd, x);
//   };
//
//   const globScanDir = (positive, negatives, opt, sync) => {
//     if (!isString(opt.cwd)) opt.cwd = process.cwd();
//     if (!isBoolean(opt.dot)) opt.dot = true;
//     if (!isBoolean(opt.silent)) opt.silent = true;
//     if (!isBoolean(opt.nonull)) opt.nonull = false;
//     if (!isBoolean(opt.cwdbase)) opt.cwdbase = false;
//     if (opt.cwdbase) opt.base = opt.cwd;
//
//     // console.log('-- glob('
//     //     + positive + ', ['
//     //     + negatives.filter(globIsNotConflicting(positive)).join(', ')
//     //     + '])');
//
//     // remove path relativity to make globs make sense
//     positive = globUnRelative(opt.cwd, positive);
//     negatives = negatives
//                   .map((x) => globUnRelative(opt.cwd, x))
//                   .filter(globIsNotConflicting(positive));
//
//     // skip files
//     opt.ignore = negatives;
//
//     if (sync) {
//       return nodeGlob.sync(positive, opt);
//     }
//
//     return new Promise((resolve, reject) => {
//       nodeGlob(positive, opt, (err, x) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(x);
//         }
//       });
//     });
//   };
//
//   /*
//     globs
//     Type: String or Array
//
//     Glob or array of globs to read.
//     Globs use node-glob (https://github.com/isaacs/node-glob) syntax
//     except that negation is fully supported.
//
//     A glob that begins with ! excludes matching files
//     from the glob results up to that point.
//     For example, consider this directory structure:
//     client/
//       a.js
//       bad.js
//       bob.js
//
//     The following expression matches a.js and bob.js:
//
//     globsSync(['client/*.js', '!client/b*.js', 'client/bob.js'])
//    */
//   const globs = (xs, opt, sync) => {
//     opt = defaultTo({}, opt);
//
//     // only one glob no need to aggregate
//     if (!isArray(xs)) {
//       return globScanDir(xs, [], opt, sync);
//     }
//
//     const positives = xs.filter(globIsPositive);
//     const negatives = xs.filter(globIsNegative).map(globRemoveNegation);
//
//     if (length(positives) === 0) {
//       throw new Error('Missing positive glob');
//     }
//
//     // only one positive glob no need to aggregate
//     if (length(positives) === 1) {
//       return globScanDir(positives[0], negatives, opt, sync);
//     }
//
//     if (sync) {
//       return flatten(
//           positives.map((x) => globScanDir(x, negatives, opt, sync)));
//     }
//
//     return Promise
//         .all(positives.map((x) => globScanDir(x, negatives, opt)))
//         .then(flatten);
//   };
//
//   const globsSync = (xs, opt) => globs(xs, opt, true);
//
//   // asynchronous
//   // globs('dist/*')
//   // .then((x) => {
//   //   console.log(x);
//   // });
//
//   // synchronous
//   console.log('----------------------------------------------');
//   console.log('--------------------- all --------------------');
//   console.log('----------------------------------------------');
//   console.log(globsSync('dist/*'));
//   console.log('----------------------------------------------');
//   console.log('----------------- exclude .js ----------------');
//   console.log('----------------------------------------------');
//   console.log(globsSync(['dist/*', '!dist/*.js']));
//   console.log('----------------------------------------------');
//   console.log('-------- exclude b*.js but take bob.js -------');
//   console.log('----------------------------------------------');
//   console.log(globsSync(['dist/*.js', '!dist/b*', 'dist/bob.js']));
//   console.log('----------------------------------------------');
//   console.log('-- [a|b]*.js  exclude b*.js but take bob.js --');
//   console.log('----------------------------------------------');
//   console.log(globsSync(['dist/[a|b]*.js', '!dist/b*', 'dist/bob.js']));
// });

// const writeStream = (file) => {
//   const ws = fs.createWriteStream(file, {encoding: 'utf8', autoClose: true});
//   return (data) => {
//     return new Promise((resolve, reject) => {
//       ws.write(data);
//       ws.on('error', reject);
//       ws.on('finish', resolve);
//       ws.end();
//     });
//   };
// };
