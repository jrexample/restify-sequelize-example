'use strict';

const sha256 = require('sha256');
const BaseManager = require('../utils/base-manager');
const AccountModel = require('../models/account-model');

class AccountManager extends BaseManager {
    constructor(db) {
        super(AccountModel(db));
    }

    beforeInsert(data) {
        data.password = sha256(data.password);
        
        return Promise.resolve(data);
    }

    validate(data) {
        let errors = {};

        if (!data.username || data.username === '') {
            errors.username = "Username is required";
        }

        if (!data.password || data.password === '') {
            errors.password = "Password is required";
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            const ValidationError = require('../utils/validation-error');
            return Promise.reject(new ValidationError("Data does not pass validation", errors));
        }

        return Promise.resolve(data);
    }
}

module.exports = AccountManager;
