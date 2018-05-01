'use strict';

const v1AccountRouter = require('../app/routers/v1/account-router');

function getV1Router(server) {
    v1AccountRouter().applyRoutes(server,       '/v1/accounts');
}

module.exports = getV1Router;
