/**
 * Created by Sergiu Ghenciu on 06/11/2018
 */

const path = require('path');
const staticServer = require('./static-server.js');
const {prepareVendors, compileScss, compressCss} = require('./tasks.js');
const {promiseSerial} = require('./utils.js');


const start = () => {
  const opt = {
        verbose: true,
        expose: [
          {path: './', as: '/'}, 
        ],
      };
  const server = staticServer(opt);
  const port = 8000;

  server.listen(port, () => {
    console.log(`Development server is listening on port ${port}`);
  });

};

promiseSerial(prepareVendors, compileScss, compressCss, start)();
