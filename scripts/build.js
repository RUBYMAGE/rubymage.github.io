/**
 * Created by Sergiu Ghenciu on 08/12/2017
 */

const {promiseSerial} = require('./utils.js');
const {
  prepareVendors,
  compileScss,
  compressCss,
} = require('./tasks.js');

const buildDev = promiseSerial(
  prepareVendors,
  compileScss,
  compressCss
);

const buildProd = promiseSerial(
  prepareVendors,
  compileScss,
  compressCss,
);

const build = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
    case 'prod':
      return buildProd();
    default:
      return buildDev();
  }
};

build();
