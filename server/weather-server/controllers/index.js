'use strict';
const app    = require('./expressServer');
const config = require('../config');

app.listen(config.port, config.host, () => {
  console.log(`✅ Weather API running`);
  console.log(`   ➜ API  : http://${config.host}:${config.port}${config.api.basePath}`);
  console.log(`   ➜ Docs : http://${config.host}:${config.port}${config.api.docsPath}`);
});
