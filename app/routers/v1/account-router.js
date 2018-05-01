'use strict';

const RouterFactory = require('../../utils/router-factory');
const Manager = require('../../managers/account-manager');

function getRouter() {
    return RouterFactory(Manager);
}

module.exports = getRouter;
