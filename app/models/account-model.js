'use strict';

function AccountModel(db) {
    const Account = db.sequelize.define('accounts', {
        username: {
            type: db.DataTypes.STRING,
            unique: true
        },
        password: {
            type: db.DataTypes.STRING
        }
    });

    return Account;
}

module.exports = AccountModel;