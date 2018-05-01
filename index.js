'use strict';

const config = require('./config');
const restify = require('restify');

const server = restify.createServer({
    name: config.name,
    version: config.version,
    url: config.hostname,
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

require('./routes/default')(server);
require('./routes/v1')(server);

server.listen(config.port, () => {
    console.log('%s listening at %s', server.name, server.url);
});
