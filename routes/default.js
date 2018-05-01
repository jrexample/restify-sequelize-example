'use strict';

const accountRouter = require('../app/routers/v1/account-router');

function getDefaultRouter(server) {
    accountRouter().applyRoutes(server,       '/accounts');
}

module.exports = getDefaultRouter;